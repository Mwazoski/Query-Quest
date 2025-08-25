import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    // Check if all users exist
    const existingUsers = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: { id: true, name: true }
    });

    if (existingUsers.length !== userIds.length) {
      return NextResponse.json(
        { error: "Some users not found" },
        { status: 404 }
      );
    }

    // Delete all users
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds }
      }
    });

    return NextResponse.json({
      message: `Successfully deleted ${userIds.length} user(s)`,
      deletedCount: userIds.length
    });

  } catch (error) {
    console.error("Error bulk deleting users:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
