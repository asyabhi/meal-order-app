import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { menuItemId, date } = await req.json();

    const existing = await prisma.order.findFirst({
      where: { userId: session.user.id, date }
    });

    if (existing) {
      return NextResponse.json({ error: "Already ordered today" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        menuItemId,
        date,
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
