import { fetchBalanceMovement } from "@/services/fetchBalanceMovement";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range");

        if (!range) {
            return NextResponse.json({ error: "Missing range query param" }, { status: 400 });
        }

        const data = await fetchBalanceMovement(range);

        if (!data || data.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Serialize BigInt fields to string before sending response
        const serializedData = data.map(item => ({
            ...item,
            awal: item.awal.toString(),
            terima: item.terima.toString(),
            pakai: item.pakai.toString(),
            saldo: item.saldo.toString(),
        }));

        return NextResponse.json(serializedData);

    } catch (error) {
        if (error instanceof Error) {
            console.error("API route error:", error.message);
        } else {
            console.error("API route error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
