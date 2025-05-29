
import { fetchSaldoGudang } from "@/services/fetchSaldoGudang";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range");

        if (!range) {
            return NextResponse.json({ error: "Missing range query param" }, { status: 400 });
        }

        const data = await fetchSaldoGudang(range);

        // Check if data is empty or undefined and handle it
        if (!data || data.length === 0) {
            return NextResponse.json([], { status: 200 }); // Return empty array, not empty response
        }

        return NextResponse.json(data);

    } catch (error) {
        if (error instanceof Error) {
            console.error("API route error:", error.message);
        } else {
            console.error("API route error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
