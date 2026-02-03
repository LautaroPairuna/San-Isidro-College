import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalGrupos, totalMedios, lastMedios] = await Promise.all([
      prisma.grupoMedios.count(),
      prisma.medio.count(),
      prisma.medio.findMany({
        take: 5,
        orderBy: { actualizadoEn: 'desc' },
        include: { grupoMedios: { select: { nombre: true } } },
      }),
    ]);

    return NextResponse.json({
      counts: {
        grupos: totalGrupos,
        medios: totalMedios,
      },
      recentActivity: lastMedios,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
