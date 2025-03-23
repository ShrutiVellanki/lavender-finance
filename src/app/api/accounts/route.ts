import { NextResponse } from "next/server";
import { accountData } from "@/api/test-data";

export async function GET() {
  try {
    return NextResponse.json(accountData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
} 