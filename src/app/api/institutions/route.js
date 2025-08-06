import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: { name: 'asc' },
      include: {
        challenges: {
          select: {
            id: true
          }
        }
      }
    });

    // Add challenge count to each institution
    const institutionsWithCounts = institutions.map(institution => ({
      ...institution,
      challengeCount: institution.challenges.length
    }));

    return NextResponse.json(institutionsWithCounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch institutions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, address, studentEmailSuffix, teacherEmailSuffix } = data;

    if (!name || !studentEmailSuffix || !teacherEmailSuffix) {
      return NextResponse.json(
        { error: "Institution name, student email suffix, and teacher email suffix are required" },
        { status: 400 }
      );
    }

    const newInstitution = await prisma.institution.create({
      data: {
        name,
        address: address || null,
        studentEmailSuffix,
        teacherEmailSuffix,
      },
    });

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create institution" },
      { status: 500 }
    );
  }
} 