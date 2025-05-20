import { parseDataStructure } from "@/lib/dataProcessing";
import { google } from "googleapis";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sheetName = searchParams.get('sheet') ?? 'Availability';
        const range = searchParams.get('range') ?? 'A5:B12';

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID!,
            range: `${sheetName}!${range}`,
        });

        const rawData = response.data.values ?? [];

        const formatted = parseDataStructure(rawData);

        return Response.json(formatted);
    } catch (err: unknown) {
        console.error('Google Sheets API error:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
