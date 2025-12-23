import { PrismaClient } from '@prisma/client';
import lrs from './seed-data/latest-report-stats.json' with { type: 'json' };

const prisma = new PrismaClient();

const timings_base = {
  root_loader: 156.1,
  remix_load_context: 0.9,
  cache_menus: 0.2,
  getUserForRequest: 21.6,
  getABTests: 140.4,
  getWaSession: 154.9,
  'cache_getContent-_': 0,
  'cache_systemPage-layout': 0,
  full_server_timing: 151.3,
  before_controller: 15.96,
  before_actions: 121.01,
  current_user: 13.41,
};

/** @type {Target[]} */
const targets = [
  // Home page
  'https://www.acmecorp.com',
  'https://www.acmecorp.com?skip3p',

  // Sale page
  'https://www.acmecorp.com/categories/beds-on-sale',
  'https://www.acmecorp.com/categories/beds-on-sale?skip3p',

  // Super category
  'https://www.acmecorp.com/categories/bedding',
  'https://www.acmecorp.com/categories/bedding?skip3p',

  // Sblp
  'https://www.acmecorp.com/categories/mattresses',
  'https://www.acmecorp.com/categories/mattresses?skip3p',

  // Series pdp
  'https://www.acmecorp.com/categories/mattresses-performance-series?tab=config',
  'https://www.acmecorp.com/categories/mattresses-performance-series?tab=config&skip3p',

  // Matt pdp
  'https://www.acmecorp.com/products/c2',
  'https://www.acmecorp.com/products/c2?skip3p',

  // Bedding pdp
  'https://www.acmecorp.com/products/lyocell-ultra-sheets-set',
  'https://www.acmecorp.com/products/lyocell-ultra-sheets-set?skip3p',
];

const userDataTargets = [
  'https://www.acmecorp.com',
  'https://www.acmecorp.com/categories/beds-on-sale',
  'https://www.acmecorp.com/categories/mattresses',
  'https://www.acmecorp.com/products/c2',
];

/**
 * Get a random int between 'min' and 'max'
 * The maximum is exclusive, and the minimum is inclusive
 */
export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getRandomScore() {
  const score = parseFloat((Math.random() * 40 + 60).toFixed(1));
  const ttfb = parseFloat((Math.random() * 100 + 200).toFixed(1));
  const lcp = parseFloat((Math.random() * 1000 + 1400).toFixed(1));
  const fcp = lcp - 500;
  return { score, ttfb, lcp, fcp };
}

async function buildReports(time) {
  const createdAt = new Date(time);
  for (const target of targets) {
    const { score, ttfb, lcp, fcp } = getRandomScore();
    const data = { target, score, ttfb, lcp, fcp, createdAt };
    await prisma.report.create({ data });
  }
}

const regions = ['dfw', 'lax', 'ord', 'iad', 'mia'];
async function buildUserData(time) {
  const createdAt = new Date(time);
  for (const target of userDataTargets) {
    const dur = parseFloat((Math.random() * 100 + 100).toFixed(1));
    let timings = { ...timings_base };
    timings.getWaSession = dur;
    timings.full_server_timing = getRandomInt(dur - 30, dur - 1);
    const regIndex = getRandomInt(0, 5);
    const region = regions[regIndex];

    const data = { target, region, ttfb: dur + 30, timings, createdAt };
    await prisma.userData.create({ data });
  }
}

/**
 * Seeds the database by clearing existing data and building reports for the
 * past 48 hours in 60-minute increments.
 */
async function seed() {
  // Clear existing data in the report table
  await prisma.report.deleteMany();
  await prisma.latestReportStats.deleteMany();
  await prisma.userData.deleteMany();
  console.log('Existing data cleared from report table.');

  const now = Date.now();
  const min = 1000 * 60;

  // Seed reports last 48 hours
  for (let i = 0; i < 96; i++) {
    const minutesAgo = min * 60 * i;
    await buildReports(now - minutesAgo);
  }

  // Seed last report stats
  await prisma.latestReportStats.create({
    data: {
      target: 'https://www.acmecorp.com/categories/beds-on-sale?skip3p',
      rawStats: JSON.stringify(lrs),
      updatedAt: new Date(),
    },
  });

  // Seed user data last 48 hours
  for (let i = 0; i < 96; i++) {
    const minutesAgo = min * 60 * i;
    const time = now - minutesAgo;
    await buildUserData(time);
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
