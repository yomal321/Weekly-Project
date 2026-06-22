import { NextResponse } from "next/server";
import {
  getAllTickets,
  createTicket,
  CreateTicketSchema,
} from "@/server/routes/tickets";

export async function GET() {
  try {
    const tickets = await getAllTickets();
    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = CreateTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const ticket = await createTicket(parsed.data);
    return NextResponse.json(ticket, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
