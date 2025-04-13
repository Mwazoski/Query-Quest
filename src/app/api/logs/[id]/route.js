import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const id = Number(params.id);
  const log = await prisma.log.findUnique({
    where: { id },
    include: { challenge: true, user: true }
  });

  if (!log) {
    return NextResponse.json({ error: 'Log not found' }, { status: 404 });
  }

  return NextResponse.json(log);
}
