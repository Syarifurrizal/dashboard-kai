// lib/googleSheet.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface FetchProps {
    sheetId?: string,
    range: string,
}

export async function fetchSheetData({ sheetId = process.env.GOOGLE_SHEET_ID, range }: FetchProps): Promise<string[][]> {
    try {
        const auth = new JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            undefined,
            (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets.readonly']
        );

        const sheets = google.sheets({ version: 'v4', auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        return res.data.values ?? [];

    } catch (err) {
        if (err instanceof Error) {
            const responseData =
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as { response?: unknown }).response === "object" &&
                (err as { response?: { data?: unknown } }).response?.data;

            console.error("💥 Google Sheets API error:", responseData || err.message);
        } else {
            console.error("💥 Unknown error:", err);
        }
        throw new Error("Failed to fetch sheet data!");
    }


}

