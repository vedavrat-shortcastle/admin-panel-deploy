import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await db.user.findMany({
      take: 10,
      select: {
        uuid: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    );
  }
}
