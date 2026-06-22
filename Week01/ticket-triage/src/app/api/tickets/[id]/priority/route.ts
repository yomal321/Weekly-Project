import { NextResponse } from "next/server";
import { updatePriority, UpdatePrioritySchema } from "@/server/routes/tickets";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ticket id" }, { status: 400 });
    }

    const body: unknown = await request.json();
    const parsed = UpdatePrioritySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid priority" },
        { status: 400 }
      );
    }

    const ticket = await updatePriority(id, parsed.data.priority);
    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json(
      { message: "Failed to update priority" },
      { status: 500 }
    );
  }
}
