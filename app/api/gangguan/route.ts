import { fetchGangguanKDK, fetchGangguanKDT, fetchGangguanKDG } from "@/services/fetchGangguan";
import { NextResponse } from "next/server";

//EXAMPLE
//GET /api/gangguan?range=Sheet1!A2:F100&type=KDK

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range");
        const type = searchParams.get("type");

        if (!range || !type) {
            return NextResponse.json({ error: "Missing range or type query param" }, { status: 400 });
        }

        let data;

        switch (type.toUpperCase()) {
            case "KDK":
                data = await fetchGangguanKDK(range);
                break;
            case "KDT":
                data = await fetchGangguanKDT(range);
                break;
            case "KDG":
                data = await fetchGangguanKDG(range);
                break;
            default:
                return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json([], { status: 200 });
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
