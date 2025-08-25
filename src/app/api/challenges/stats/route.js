import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all challenges for general stats (no filters)
    const allChallenges = await prisma.challenge.findMany({
      select: {
        id: true,
        level: true,
        score: true,
        solves: true,
      },
    });

    const totalChallenges = allChallenges.length;
    const totalSolves = allChallenges.reduce((sum, challenge) => sum + challenge.solves, 0);
    const totalPoints = allChallenges.reduce((sum, challenge) => sum + challenge.score, 0);
    const avgDifficulty = totalChallenges > 0 
      ? Math.round(allChallenges.reduce((sum, challenge) => sum + challenge.level, 0) / totalChallenges * 10) / 10
      : 0;

    return NextResponse.json({
      totalChallenges,
      totalSolves,
      avgDifficulty,
      totalPoints,
    });
  } catch (error) {
    console.error("Error fetching challenge stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge stats" },
      { status: 500 }
    );
  }
}
