import { prisma } from '~/db.server';

const twentyFourHrsInMs = 1000 * 60 * 60 * 24;

/**
 * Retrieves reports based on a given start date and number of days.
 *
 * @param {number[]} targets - The targets to include.
 * @param {number} start - The start date in milliseconds since epoch.
 * @param {number} days - The number of days to retrieve reports for from `start` date.
 * @return {Report[]}
 */
export async function getReports(targets, start, days) {
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() - days * twentyFourHrsInMs);

  const reports = await prisma.report.findMany({
    select: {
      id: true,
      target: true,
      score: true,
      ttfb: true,
      lcp: true,
      fcp: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
    where: {
      createdAt: { gte: endDate, lte: startDate },
      target: { in: targets },
    },
  });

  const results = reports.map(r => ({
    id: r.id,
    target: r.target,
    score: Number(r.score),
    ttfb: r.ttfb == null ? null : Number(r.ttfb),
    lcp: r.lcp == null ? null : Number(r.lcp),
    fcp: r.fcp == null ? null : Number(r.fcp),
    createdAt: new Date(r.createdAt),
  }));

  return results;
}

export function createReport({ target, score, ttfb, lcp, fcp, createdAt }) {
  return prisma.report.create({
    data: {
      target,
      score,
      ...(ttfb != null ? { ttfb } : {}),
      ...(fcp != null ? { fcp } : {}),
      ...(lcp != null ? { lcp } : {}),
      ...(createdAt ? { createdAt } : {}),
    },
  });
}

export function deleteReport({ id }) {
  return prisma.report.deleteMany({
    where: { id },
  });
}
