import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      institutionName,
      contactName,
      contactEmail,
      contactPhone,
      website,
      studentEmailSuffix,
      teacherEmailSuffix,
      message,
      estimatedStudents,
      estimatedTeachers
    } = data;

    // Validate required fields
    if (!institutionName || !contactName || !contactEmail || !studentEmailSuffix || !teacherEmailSuffix) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save the contact request to the database
    const contactRequest = await prisma.contactRequest.create({
      data: {
        institutionName,
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,
        website: website || null,
        studentEmailSuffix,
        teacherEmailSuffix,
        message: message || null,
        estimatedStudents: estimatedStudents ? parseInt(estimatedStudents) : null,
        estimatedTeachers: estimatedTeachers ? parseInt(estimatedTeachers) : null,
        status: "pending"
      }
    });

    console.log('=== INSTITUTION ACCESS REQUEST SAVED ===');
    console.log('Request ID:', contactRequest.id);
    console.log('Institution:', institutionName);
    console.log('Status: Pending approval');
    console.log('========================================');

    return NextResponse.json({
      message: "Contact request submitted successfully. We'll review your institution's request and contact you soon."
    });

  } catch (error) {
    console.error("Error processing contact request:", error);
    return NextResponse.json(
      { error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
} 