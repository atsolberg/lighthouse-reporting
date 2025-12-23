import { Temporal } from '@js-temporal/polyfill';
import { cn } from '~/lib/utils';
import { targetEnum } from '~/targets';
import Enumify from '~/Enumify';

export const scrollClasses = cn(
  'scrollbar',
  'scrollbar-track-rounded-full',
  'scrollbar-thumb-rounded-full',
  'scrollbar-track-slate-500',
  'scrollbar-thumb-slate-700'
);

export function updateUrlSearch(queryKey, queryValue) {
  const currentSearchParams = new URLSearchParams(window.location.search);
  const oldQuery = currentSearchParams.get(queryKey) ?? '';
  if (queryValue === oldQuery) return;

  if (queryValue) {
    currentSearchParams.set(queryKey, queryValue);
  } else {
    currentSearchParams.delete(queryKey);
  }
  const newUrl = [window.location.pathname, currentSearchParams.toString()]
    .filter(Boolean)
    .join('?');
  window.history.replaceState(null, '', newUrl);
}

export function updateParams({ days, targets }) {
  if (days) updateUrlSearch('days', days);
  if (targets) updateUrlSearch('t', targets);
}

function getIpAddressFromHeader(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  let ip = '';

  if (forwarded) {
    // Taking the first IP from the list of IPs, if there are multiple
    ip = forwarded.split(',')[0];
  } else {
    // Fallback if the IP isn't forwarded (e.g., local development)
    ip = '98.59.29.72'; // Minneapolis
  }

  return ip;
}

const IPINFO_TOKEN = 'fde964395e0eb6';
export async function getTimezone(req) {
  let ip = getIpAddressFromHeader(req);
  if (ip.substring(0, 7) === '::ffff:') ip = ip.substring(7);

  try {
    const resp = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
    const json = await resp.json();
    const timezone = json.timezone;
    return timezone;
  } catch (error) {
    console.error('Failed to get timezone', error?.message);
    return 'America/Chicago';
  }
}

// Formats date as:
// - "HH:mm am/pm" if the date is today in the given timezone
// - "MM/DD/YYYY HH:mm am/pm" otherwise
export function formatTimestampInTZ(input, timeZone) {
  if (!input) return '';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const ymdFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const now = new Date();
  const dateYMD = ymdFormatter.format(date);
  const nowYMD = ymdFormatter.format(now);

  const timeStr = timeFormatter.format(date).toLowerCase();

  if (dateYMD === nowYMD) return timeStr;
  else return `${dateYMD} ${timeStr}`;
}

/**
 * Retrieves the date and time in the provided time zone.
 *
 * @example
 *   const date = await getDateInTZ('2022-10-01', req);
 *   console.log(date.toString()); // "2022-10-01T00:00:00-05:00[America/Chicago]"
 *
 * @param {string} start - The start date string in ISO 8601 format.
 * @param {Request} req - The request object containing the client's information.
 *
 * @returns {Temporal.ZonedDateTime} - The date and time in the provided time zone.
 */
export async function getDateInTZ(start, req) {
  const timeZone = await getTimezone(req);
  const plainDate = Temporal.PlainDate.from(start);
  const zonedDateTime = plainDate.toZonedDateTime({
    plainTime: Temporal.PlainTime.from('00:00'),
    timeZone,
  });

  return zonedDateTime;
}

export const red = '#FD2E2C';
export const orange = '#FFA500';
export const green = '#12C55F';

export class Grade extends Enumify {
  static Good = new Grade(green);
  static Ok = new Grade(orange);
  static Bad = new Grade(red);
  static _ = this.closeEnum();

  constructor(color) {
    super();
    this.color = color;
  }
}

export function gradeScore(score) {
  const scoreNum = Number(score);
  if (scoreNum < 50) return Grade.Bad;
  if (scoreNum < 90) return Grade.Ok;
  return Grade.Good;
}

export function gradeTtfb(value) {
  const ttfb = Number(value);
  if (ttfb > 1800) return Grade.Bad;
  if (ttfb > 800) return Grade.Ok;
  return Grade.Good;
}

export function gradeLcp(value) {
  const lcp = Number(value);
  if (lcp > 4000) return Grade.Bad;
  if (lcp > 2500) return Grade.Ok;
  return Grade.Good;
}

export function gradeTbt(value) {
  const tbt = Number(value);
  if (tbt > 600) return Grade.Bad;
  if (tbt > 200) return Grade.Ok;
  return Grade.Good;
}

export function gradeFcp(value) {
  const fcp = Number(value);
  if (fcp > 3000) return Grade.Bad;
  if (fcp > 1800) return Grade.Ok;
  return Grade.Good;
}

export function gradeSpeedIndex(value) {
  const speedIndex = Number(value);
  if (speedIndex > 5800) return Grade.Bad;
  if (speedIndex > 3400) return Grade.Ok;
  return Grade.Good;
}

export function gradeCls(value) {
  const cls = Number(value);
  if (cls > 0.25) return Grade.Bad;
  if (cls > 0.1) return Grade.Ok;
  return Grade.Good;
}

const graders = {
  ttfb: gradeTtfb,
  lcp: gradeLcp,
  tbt: gradeTbt,
  fcp: gradeFcp,
  speed_index: gradeSpeedIndex,
  cls: gradeCls,
  score: gradeScore,
};

export function getGrade(type, score) {
  const grader = graders[type];
  return grader(score);
}

export function formatMetricValue(type, value) {
  if (['ttfb', 'lcp', 'tbt', 'fcp', 'speed_index'].includes(type)) {
    return `${value.toFixed(0)} ms`;
  }
  return value;
}

export function getInitialShown(targets, params) {
  if (!params) {
    return targets.reduce((acc, t) => {
      acc[t] = true;
      return acc;
    }, {});
  } else {
    return targets.reduce((acc, t) => {
      const targetId = targetEnum[t].id;
      acc[t] = targetId ? params.includes(targetId) : false;
      return acc;
    }, {});
  }
}

const day_ms = 1000 * 60 * 60 * 24;

/** Function to generate timestamps for the data range */
export function generateXaxisTicks(chartData, tsProp = 'name') {
  if (!chartData || chartData.length === 0)
    return { ticks: [], showTime: false };

  // Find min and max timestamps in the data
  let minTimestamp = Number.MAX_SAFE_INTEGER;
  let maxTimestamp = Number.MIN_SAFE_INTEGER;

  chartData.forEach(item => {
    let ts = item[tsProp];
    if (ts instanceof Date) ts = ts.getTime();
    if (typeof ts === 'string') ts = new Date(ts).getTime();
    if (ts < minTimestamp) minTimestamp = ts;
    if (ts > maxTimestamp) maxTimestamp = ts;
  });

  // Convert to Date objects
  const startDate = new Date(minTimestamp);
  const endDate = new Date(maxTimestamp);

  // Calculate date range in days
  const dateRangeInDays = Math.ceil((endDate - startDate) / day_ms);
  const gt3days = dateRangeInDays > 3;
  const lt1day = dateRangeInDays <= 1;

  const ticks = [];

  if (lt1day) {
    // For 1 day or less, add ticks every 3 hours
    // Start at midnight of the start date
    const tickDate = new Date(startDate);
    tickDate.setHours(0, 0, 0, 0);

    // If start date is after the initial midnight, use the start date's hour (rounded down to nearest 3-hour mark)
    if (tickDate.getTime() < startDate.getTime()) {
      tickDate.setTime(startDate.getTime());
      const hour = tickDate.getHours();
      const roundedHour = Math.floor(hour / 3) * 3;
      tickDate.setHours(roundedHour, 0, 0, 0);
    }

    // Generate ticks every 3 hours until we reach the end date
    while (tickDate.getTime() <= endDate.getTime()) {
      ticks.push(tickDate.getTime());
      tickDate.setHours(tickDate.getHours() + 3);
    }
  } else {
    // Set to midnight of the start date
    const midnight = new Date(startDate);
    midnight.setHours(0, 0, 0, 0);

    // If start date is after midnight, move to next day
    if (midnight.getTime() < startDate.getTime()) {
      midnight.setDate(midnight.getDate() + 1);
    }

    // Generate timestamps until we reach the end date
    while (midnight.getTime() <= endDate.getTime()) {
      // Always add midnight
      ticks.push(midnight.getTime());

      // Add noon if date range is 3 days or less
      if (!gt3days) {
        const noon = new Date(midnight);
        noon.setHours(12, 0, 0, 0);
        if (noon.getTime() <= endDate.getTime()) {
          ticks.push(noon.getTime());
        }
      }

      midnight.setDate(midnight.getDate() + 1);
    }
  }

  return {
    ticks,
    showTime: !gt3days || lt1day,
    min: minTimestamp,
    max: maxTimestamp,
  };
}
