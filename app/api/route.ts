// /app/api/availability/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const apiKey = process.env.GCLOUD_API_KEY;
    const spreadsheetId = process.env.GSHEET_API_KEY;

    const urlParams = req.nextUrl.searchParams;
    const range = urlParams.get('range');

    if (!range) {
        return new Response(JSON.stringify({ error: 'Missing range parameter' }), {
            status: 400,
        });
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data from Google Sheets' }), {
                status: res.status,
            });
        }

        const data = await res.json();
        return Response.json(data);
    } catch {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
