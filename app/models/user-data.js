import { prisma } from '~/db.server';

const minuteMs = 1000 * 60;
const hourMs = minuteMs * 60;
const dayMs = hourMs * 24;
const dayMs3 = 3 * dayMs;
const dayMs4 = 4 * dayMs;

export async function getUserData(start, rangeMs) {
  const startDate = new Date(start);
  const windowMs =
    typeof rangeMs === 'number' && !Number.isNaN(rangeMs) ? rangeMs : 7 * dayMs;
  const endDate = new Date(startDate.getTime() - windowMs);

  let rows = await prisma.userData.findMany({
    select: {
      id: true,
      target: true,
      region: true,
      ttfb: true,
      timings: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    where: {
      createdAt: { gte: endDate, lte: startDate },
    },
    take: 20_000,
  });

  // Truncate data, 3-4 days, only take every 3rd row, ect
  const range_3_to_4_days = rangeMs >= dayMs3 && rangeMs < dayMs4;
  const range_4_plus = rangeMs >= dayMs4;
  if (range_3_to_4_days) rows = rows.filter((_, i) => i % 3 === 0);
  if (range_4_plus) rows = rows.filter((_, i) => i % 4 === 0);

  const results = rows.map(r => ({
    id: r.id,
    target: r.target,
    region: r.region,
    ttfb: r.ttfb == null ? null : Number(r.ttfb),
    timings: r.timings,
    createdAt: new Date(r.createdAt),
  }));

  return results;
}

export async function getUserDataReport(id) {
  const report = await prisma.userData.findUnique({
    select: {
      id: true,
      target: true,
      region: true,
      ttfb: true,
      timings: true,
      createdAt: true,
    },
    where: { id },
  });

  return report;
}

export function createUserData({ target, region, ttfb, timings, createdAt }) {
  return prisma.userData.create({
    data: {
      target,
      region,
      ttfb,
      timings,
      ...(createdAt ? { createdAt } : {}),
    },
  });
}
