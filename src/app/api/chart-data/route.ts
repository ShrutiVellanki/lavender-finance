import { NextResponse } from "next/server";
import { chartData } from "@/api/test-data";

export async function GET() {
  try {
    return NextResponse.json(chartData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
} 