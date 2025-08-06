import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase() 
      },
      include: {
        institution: true,
      },
    });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email address before logging in. Check your inbox for a verification link." },
        { status: 403 }
      );
    }

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
} 