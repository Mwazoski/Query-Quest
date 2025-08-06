import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        institution: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { name, alias, institution_id, isAdmin, isTeacher } = data;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        alias: alias || undefined,
        institution_id: institution_id && institution_id !== "none" ? parseInt(institution_id) : null,
        isAdmin: isAdmin !== undefined ? isAdmin : undefined,
        isTeacher: isTeacher !== undefined ? isTeacher : undefined,
      },
      include: {
        institution: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 