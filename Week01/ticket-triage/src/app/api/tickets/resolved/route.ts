import { NextResponse } from "next/server";
import { getResolvedTickets } from "@/server/routes/tickets";

export async function GET() {
  try {
    const tickets = await getResolvedTickets();
    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch resolved tickets" },
      { status: 500 }
    );
  }
}
