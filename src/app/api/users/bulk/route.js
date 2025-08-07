import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { users } = await request.json();

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "No users provided" }, { status: 400 });
    }

    // Validate users data
    const validatedUsers = users.map(user => ({
      name: user.name,
      alias: user.alias,
      password: user.password || 'defaultpassword123',
      isAdmin: Boolean(user.isAdmin),
      isTeacher: Boolean(user.isTeacher),
      isEmailVerified: false,
      solvedChallenges: 0,
      points: 0,
      
      institution_id: user.institution_id || null
    }));

    // Create users in database
    const createdUsers = await prisma.user.createMany({
      data: validatedUsers,
      skipDuplicates: true, // Skip if user with same name already exists
    });

    return NextResponse.json({ 
      message: `Successfully imported ${createdUsers.count} users`,
      importedCount: createdUsers.count,
      totalUsers: users.length
    });
  } catch (error) {
    console.error('Error importing users:', error);
    return NextResponse.json({ error: "Failed to import users" }, { status: 500 });
  }
} 