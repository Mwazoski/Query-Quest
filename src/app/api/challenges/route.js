import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    
    let whereClause = {};
    if (institutionId) {
      whereClause.institution_id = parseInt(institutionId);
    }
    
    const challenges = await prisma.challenge.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        institution: true,
      },
    });
    return NextResponse.json(challenges);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      statement, 
      help, 
      solution, 
      level, 
      score, 
      score_base, 
      score_min, 
      institution_id,
      creator_id 
    } = data;

    // Validate required fields
    if (!statement || !solution || !level || !score || !score_base || !score_min) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the creator is a teacher or admin
    const creator = await prisma.user.findUnique({
      where: { id: creator_id },
      include: { institution: true },
    });

    if (!creator || (!creator.isTeacher && !creator.isAdmin)) {
      return NextResponse.json(
        { error: "Only teachers and admins can create challenges" },
        { status: 403 }
      );
    }

    // If creator is a teacher, ensure they can only create challenges for their institution
    if (creator.isTeacher && !creator.isAdmin) {
      if (!creator.institution_id) {
        return NextResponse.json(
          { error: "Teachers must be associated with an institution to create challenges" },
          { status: 403 }
        );
      }
      
      if (institution_id && parseInt(institution_id) !== creator.institution_id) {
        return NextResponse.json(
          { error: "Teachers can only create challenges for their own institution" },
          { status: 403 }
        );
      }
      
      // Set institution_id to teacher's institution if not provided
      institution_id = creator.institution_id;
    }

    const newChallenge = await prisma.challenge.create({
      data: {
        statement,
        help: help || null,
        solution,
        level,
        score,
        score_base,
        score_min,
        institution_id: institution_id ? parseInt(institution_id) : null,
      },
      include: {
        institution: true,
      },
    });

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
} 