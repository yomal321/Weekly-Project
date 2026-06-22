import { NextResponse } from "next/server";
import { resolveTicket } from "@/server/routes/tickets";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ticket id" }, { status: 400 });
    }

    const ticket = await resolveTicket(id);
    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json(
      { message: "Failed to resolve ticket" },
      { status: 500 }
    );
  }
}
