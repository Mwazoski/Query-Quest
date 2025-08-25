import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { openaiService } from '@/lib/openai-service';

const prisma = new PrismaClient();

// Database query functions for context-aware responses
async function getUserStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      institution: true,
      _count: {
        select: {
          solvedChallenges: true,
          createdLessons: true,
        },
      },
    },
  });

  const solvedChallenges = await prisma.userChallenge.count({
    where: { user_id: userId },
  });

  const totalPoints = await prisma.userChallenge.aggregate({
    where: { user_id: userId },
    _sum: { score: true },
  });

  return {
    name: user.name,
    alias: user.alias,
    institution: user.institution?.name,
    solvedChallenges,
    totalPoints: totalPoints._sum.score || 0,
    isTeacher: user.isTeacher,
    isAdmin: user.isAdmin,
  };
}

async function getInstitutionStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { institution: true },
  });

  if (!user?.institution) return null;

  const stats = await prisma.$transaction([
    prisma.user.count({
      where: { institution_id: user.institution.id },
    }),
    prisma.challenge.count({
      where: { institution_id: user.institution.id },
    }),
    prisma.lesson.count({
      where: { institution_id: user.institution.id },
    }),
  ]);

  return {
    name: user.institution.name,
    totalUsers: stats[0],
    totalChallenges: stats[1],
    totalLessons: stats[2],
  };
}

async function getPopularChallenges(userId, limit = 5) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { institution: true },
  });

  if (!user?.institution) return [];

  return await prisma.challenge.findMany({
    where: { institution_id: user.institution.id },
    include: {
      _count: {
        select: { userChallenges: true },
      },
    },
    orderBy: { solves: 'desc' },
    take: limit,
  });
}

async function getRecentLessons(userId, limit = 3) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { institution: true },
  });

  if (!user?.institution) return [];

  return await prisma.lesson.findMany({
    where: {
      institution_id: user.institution.id,
      isPublished: true,
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

// System prompt is now handled by the openaiService in config/chat-config.js

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    const authToken = cookieStore.get('auth-token');

    if (!userCookie || !authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let userData;
    try {
      userData = JSON.parse(userCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 401 }
      );
    }

    if (!userData?.id) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }

    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const userId = userData.id;

    // Gather context data
    const [userStats, institutionStats, popularChallenges, recentLessons] = await Promise.all([
      getUserStats(userId),
      getInstitutionStats(userId),
      getPopularChallenges(userId),
      getRecentLessons(userId),
    ]);

    // Generate AI response using OpenAI with context
    const contextData = {
      userStats,
      institutionStats,
      popularChallenges,
      recentLessons,
    };

    const response = await openaiService.generateResponse(
      message,
      conversationHistory,
      contextData
    );

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OpenAI-based response generation is now handled by openaiService.generateResponse()
