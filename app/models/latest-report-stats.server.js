import { prisma } from '~/db.server';

/**
 * Retrieves stats for the last report for each target.
 */
export async function getLastReportStats() {
  const stats = await prisma.latestReportStats.findMany({
    select: {
      target: true,
      rawStats: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const results = stats.map(r => ({
    target: r.target,
    rawStats: r.rawStats,
    updatedAt: new Date(r.updatedAt),
  }));

  return results;
}

export function createLastReportStats({ target, rawStats }) {
  return prisma.latestReportStats.upsert({
    where: { target },
    create: {
      target,
      rawStats,
      updatedAt: new Date(),
    },
    update: {
      rawStats,
      updatedAt: new Date(),
    },
  });
}

export function deleteReport({ target }) {
  return prisma.latestReportStats.deleteMany({
    where: { target },
  });
}
