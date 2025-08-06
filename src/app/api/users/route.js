import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken, sendMockVerificationEmail } from "@/lib/email";
import { validateEmailDomain } from "@/lib/institution-utils";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        institution: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, alias, email, password, institution_id, isAdmin, isTeacher } = data;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email domain and determine role/institution
    const emailValidation = await validateEmailDomain(email);
    
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create new user with auto-detected role and institution
    const newUser = await prisma.user.create({
      data: {
        name,
        alias: alias || null,
        email: email.toLowerCase(),
        password, // In a real app, you'd hash this password
        verificationToken,
        institution_id: emailValidation.institution.id,
        isAdmin: isAdmin || false,
        isTeacher: emailValidation.role === 'teacher',
        points: 0,
        solvedChallenges: 0,
      },
      include: {
        institution: true,
      },
    });

    // Send verification email
    const emailSent = await sendMockVerificationEmail(email, name, verificationToken);
    
    if (!emailSent) {
      // If email fails, we should still create the user but notify about the issue
      console.warn("Failed to send verification email to:", email);
    }

    // Return success response without sensitive data
    const { password: _, verificationToken: __, ...userResponse } = newUser;
    return NextResponse.json({
      ...userResponse,
      message: "Registration successful! Please check your email to verify your account."
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
} 
