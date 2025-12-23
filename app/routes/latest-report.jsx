import React from 'react';
import { targetEnum } from '~/targets';
import { getTimezone, formatTimestampInTZ } from '~/utils';
import { getLastReportStats } from '~/models/latest-report-stats.server';
import { useLoaderData } from 'react-router';
import TestScoreCard from '~/components/TestScoreCard';
import TestDetailsCard from '~/components/TestDetailsCard';
import { cn } from '~/lib/utils';

const target_entries = Object.entries(targetEnum);

export const loader = async ({ request }) => {
  let latestReportStats = await getLastReportStats();
  latestReportStats = latestReportStats.reduce((acc, report) => {
    acc[report.target] = report;
    return acc;
  }, {});
  const timeZone = await getTimezone(request);
  return { latestReportStats, timeZone };
};

export default function Component() {
  const { latestReportStats, timeZone } = useLoaderData();

  const targets = target_entries.map(([path, data]) => ({ path, ...data }));
  const [target, setTarget] = React.useState(targets[0]);
  const data = latestReportStats[target.path];
  const testData = data ? JSON.parse(data.rawStats) : null;

  return (
    <main className="container px-4 mx-auto relative min-h-screen">
      <section className="mt-4">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-between gap-2">
          <span className="flex items-baseline">
            Latest Report
            <span className="text-xs block sm:inline-block sm:ml-2">
              {data?.updatedAt
                ? formatTimestampInTZ(data.updatedAt, timeZone)
                : null}
            </span>
          </span>
          <select
            name="target"
            className={cn(
              'bg-slate-700 text-slate-200 text-sm',
              'py-0.5 pl-2 pr-8 ml-1',
              'cursor-pointer',
              'rounded',
              'self-stretch'
            )}
            onChange={e =>
              setTarget(targets.find(t => t.path === e.target.value))
            }
            value={target.path}
          >
            {targets.map(t => (
              <option key={t.path} value={t.path}>
                {t.label}
              </option>
            ))}
          </select>
        </h1>

        {testData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TestScoreCard data={testData} />
            </div>
            <TestDetailsCard runs={testData.details} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
