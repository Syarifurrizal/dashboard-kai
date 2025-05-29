import { fetchPerawatanNormal, fetchPerawatanPersen } from "@/services/fetchPerawatan";
import { NextResponse } from "next/server";

//EXAMPLE
//GET /api/perawatan?range=Sheet1!A2:F100&type=normal
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
            case "NORMAL":
                data = await fetchPerawatanNormal(range);
                break;
            case "PERSEN":
                data = await fetchPerawatanPersen(range);
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
