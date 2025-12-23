import { redirect } from 'react-router';
import { Form, useLoaderData, useLocation } from 'react-router';

import { deleteReport, getReports } from '~/models/report.server';
import Chart from '~/components/Chart';
import ReportTable from '~/components/ReportTable';
import { getTargetById } from '~/targets';
import { getDateInTZ } from '~/utils';
import ChartTargets from '~/components/ChartTargets';
import { ReleaseProvider } from '~/components/ReleasesProvider';
import { cn } from '~/lib/utils';
import ReleaseTooltip from '~/components/ReleaseTooltip.jsx';

const defaultTargets = ['1', '2', '3', '4'];

export const meta = () => [{ title: 'AcmeCorp Lighthouse Reporting' }];

export const loader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const days = Number(params.has('days') ? params.get('days') : 3);
  let targetsParam = (params.get('t[]') || '').split(',').filter(Boolean);
  if (!targetsParam.length) targetsParam = defaultTargets;
  const targetIds = targetsParam.map(Number);

  const targets = targetIds.map(getTargetById).filter(Boolean).map(String);

  let start = Date.now();
  if (params.has('start')) {
    try {
      const startParam =
        params.get('start') || new Date().toISOString().split('T')[0];
      const date = await getDateInTZ(startParam, request);
      start = date.toInstant().epochMilliseconds;
      const todayMidnight = new Date().setHours(0, 0, 0, 0);
      if (start >= todayMidnight) start = Date.now();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      /** start should be in the format `YYYY-MM-DD` */
      start = Date.now();
    }
  }

  const reports = await getReports(targets, start, days);
  return { reports, isProd: process.env.NODE_ENV === 'production' };
};

export const action = async ({ request }) => {
  const fd = await request.formData();
  const action = fd.get('_action');

  if (action === 'chart-settings') {
    const days = fd.get('days');
    const startParam = `${fd.get('start')}` || Date.now();
    const start = new Date(startParam).toISOString().split('T')[0];
    const targets = fd.getAll('t[]');
    return redirect(`/?t[]=${targets.join(',')}&days=${days}&start=${start}`);
  }

  const method = request.method;
  const formData = await request.formData();
  const id = formData.get('id');

  if (method === 'DELETE') {
    if (!id) {
      throw new Response('Missing "id" in request body', { status: 400 });
    }
    const result = await deleteReport({ id });
    return { deleted: result.count };
  }

  return null;
};

export default function Index() {
  const params = new URLSearchParams(useLocation().search);
  const start = params.get('start') || new Date().toISOString().split('T')[0];
  const days = Number(params.get('days')) || 3;
  const targets = (params.get('t[]') || '1,2,3,4').split(',').map(Number);
  const data = useLoaderData();
  const reports = data.reports;
  const groupedData = reports.reduce((acc, report) => {
    if (!acc[report.target]) acc[report.target] = [];
    acc[report.target].push(report);
    return acc;
  }, {});

  return (
    <main className="container px-4 mx-auto relative min-h-screen">
      <Form method="POST" onChange={e => e.currentTarget.submit()}>
        <input type="hidden" name="_action" value="chart-settings" />
        <div className="mt-4 flex items-center justify-end gap-3">
          <label>
            <input
              type="date"
              name="start"
              className={cn(
                'px-2 py-0.5',
                'cursor-text',
                'bg-slate-200 text-black rounded'
              )}
              defaultValue={start}
            />
          </label>
          <select
            name="days"
            className={cn(
              'bg-slate-200 text-black',
              'py-0.5 pl-2 pr-8 ml-1',
              'cursor-pointer',
              'rounded',
              'self-stretch'
            )}
            defaultValue={days}
          >
            <option value="1">Last day</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
            <option value="60">Last 2 months</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
        </div>

        <div className="relative pt-4 lg:flex gap-4">
          <div className="w-full lg:w-9/12">
            <ReleaseProvider>
              <ReleaseTooltip />
              <Chart data={groupedData} targets={targets} />
            </ReleaseProvider>
          </div>
          <div className="w-full lg:w-3/12 lg:self-stretch">
            <ChartTargets targets={targets} />
          </div>
        </div>
      </Form>

      <details
        className="group mb-4 bg-slate-800 mt-4 p-3 rounded-md"
        open={false}
      >
        <summary className=" cursor-pointer flex items-center">
          <svg
            className="w-6 h-6 transform -rotate-90 group-open:rotate-0 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="ml-2 text-lg font-medium">Report Data</span>
        </summary>
        <div className="mt-4 grid gap-4 gap-y-8 grid-cols-1 md:grid-cols-2">
          {Object.entries(groupedData).map(([target, targetData]) => (
            <ReportTable key={target} target={target} reports={targetData} />
          ))}
        </div>
      </details>
    </main>
  );
}
