import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with the verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user to mark email as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null
      }
    });

    return NextResponse.json({
      message: "Email verified successfully! You can now log in to your account."
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
} 