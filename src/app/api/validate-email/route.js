import { NextResponse } from "next/server";
import { validateEmailDomain } from "@/lib/institution-utils";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const validation = await validateEmailDomain(email);
    return NextResponse.json(validation);

  } catch (error) {
    console.error("Error validating email:", error);
    return NextResponse.json(
      { error: "Failed to validate email" },
      { status: 500 }
    );
  }
} 