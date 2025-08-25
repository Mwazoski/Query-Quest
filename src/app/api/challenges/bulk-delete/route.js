import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request) {
  try {
    const { challengeIds } = await request.json();

    if (!challengeIds || !Array.isArray(challengeIds) || challengeIds.length === 0) {
      return NextResponse.json(
        { error: "Challenge IDs array is required" },
        { status: 400 }
      );
    }

    // Check if all challenges exist
    const existingChallenges = await prisma.challenge.findMany({
      where: {
        id: { in: challengeIds }
      },
      select: { id: true, statement: true }
    });

    if (existingChallenges.length !== challengeIds.length) {
      return NextResponse.json(
        { error: "Some challenges not found" },
        { status: 404 }
      );
    }

    // Delete all challenges
    await prisma.challenge.deleteMany({
      where: {
        id: { in: challengeIds }
      }
    });

    return NextResponse.json({
      message: `Successfully deleted ${challengeIds.length} challenge(s)`,
      deletedCount: challengeIds.length
    });

  } catch (error) {
    console.error("Error bulk deleting challenges:", error);
    return NextResponse.json(
      { error: "Failed to delete challenges" },
      { status: 500 }
    );
  }
}
