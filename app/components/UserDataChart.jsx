import React from 'react';
import { targetEnum } from '~/targets';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import XTicks from '~/components/XTicks';
import CustomTooltip from '~/components/CustomTooltip';
import { ColoredDot, TtfbDot } from '~/components/Dot';
import { generateXaxisTicks, getGrade, Grade } from '~/utils';
import NewTabIcon from '~/icons/NewTabIcon';
import ReportModal from '~/components/ReportModal';
import Circle from '~/components/Circle';
import Square from '~/components/Square';
import Triangle from '~/components/Triangle';
import ReleaseTooltip from '~/components/ReleaseTooltip';
import { cn } from '~/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import pinImg from '~/assets/icon-p75-pin.svg';
import ReleaseRefLines from '~/components/ReleaseRefLines';

const serverDeltaDesc =
  'The average difference between the Remix session fetch time and Rails ' +
  'session fetch time.<br><br>You can think of this as network time between Remix' +
  ' and Rails';

function getLabel(chartField, chartType) {
  if (chartType === 'page') {
    let url = chartField;
    // Remove the ending '/' for home page
    if (url.match(/.com\/$/)) url = url.substring(0, url.length - 1);
    const t = targetEnum[url];
    return { url, label: t.label };
  } else if (chartType === 'region') {
    return { label: chartField.toUpperCase() };
  } else {
    return null;
  }
}

function gradeStat(ttfb) {
  const grade = getGrade('ttfb', ttfb);
  let Shape = Circle;
  if (grade === Grade.Ok) Shape = Square;
  if (grade === Grade.Bad) Shape = Triangle;
  return { grade: grade, shape: Shape };
}

function getGradeBreakdown(data) {
  const bd = data.reduce(
    (acc, curr) => {
      const grade = getGrade('ttfb', curr.ttfb);
      if (grade === Grade.Good) acc.good = acc.good + 1;
      if (grade === Grade.Ok) acc.ok = acc.ok + 1;
      if (grade === Grade.Bad) acc.bad = acc.bad + 1;
      return acc;
    },
    { good: 0, ok: 0, bad: 0 }
  );

  const percentages = {
    good: bd.good / data.length,
    ok: bd.ok / data.length,
    bad: bd.bad / data.length,
  };

  return percentages;
}

function calcServerDelta(data) {
  const timings = data
    .map(d => d.timings)
    .filter(t => t.full_server_timing && t.root_loader);

  const totalDelta = timings.reduce((acc, curr) => {
    const delta = Math.abs(curr.root_loader - curr.full_server_timing);
    return acc + delta;
  }, 0);
  const avgDelta = totalDelta / timings.length;

  return Math.round(avgDelta);
}

function calcPercentile(arr, p) {
  const values = arr.map(d => d.ttfb).sort((a, b) => a - b);
  const idx = (p / 100) * (values.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);

  if (lower === upper) return Math.round(values[lower]);

  const result =
    values[lower] + (values[upper] - values[lower]) * (idx - lower);

  return Math.round(result);
}

function GradeBreakdown({ data }) {
  const bd = getGradeBreakdown(data);
  return (
    <div className="rounded-xs w-64 h-1 flex items-center relative">
      <div
        className="h-1"
        style={{
          backgroundColor: Grade.Good.color,
          width: `${bd.good * 100}%`,
        }}
      ></div>
      <div
        className="h-1"
        style={{
          backgroundColor: Grade.Ok.color,
          width: `${bd.ok * 100}%`,
        }}
      ></div>
      <div
        className="h-1"
        style={{
          backgroundColor: Grade.Bad.color,
          width: `${bd.bad * 100}%`,
        }}
      ></div>
      <img
        src={pinImg}
        alt="pin"
        className="absolute"
        style={{ top: -10, left: '75%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
}

function UserDataChart({ chartField, chartType, data }) {
  if (!data?.length) return null;

  const [focusedReport, setFocusedReport] = React.useState(null);
  const [modelOpen, setModelOpen] = React.useState(false);

  const avg = Math.round(
    data.reduce((acc, curr) => acc + curr.ttfb, 0) / data.length
  );
  const p75 = calcPercentile(data, 75);
  const p95 = calcPercentile(data, 95);
  const p99 = calcPercentile(data, 99);
  const serverDelta = calcServerDelta(data);

  const { grade: avgGrade, shape: AvgShape } = gradeStat(avg);
  const { grade: p75Grade, shape: P75Shape } = gradeStat(p75);
  const { grade: p95Grade, shape: P95Shape } = gradeStat(p95);
  const { grade: p99gGrade, shape: P99Shape } = gradeStat(p99);

  const { label, url } = getLabel(chartField, chartType);
  const xTicks = generateXaxisTicks(data, 'createdAt');

  async function handleDotClick(event, data) {
    const id = data.payload.id;
    try {
      const resp = await fetch('/api/user-data/' + id);
      const report = await resp.json();
      setFocusedReport(report);
      setModelOpen(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <ReportModal
        report={focusedReport}
        open={modelOpen}
        onOpenChange={setModelOpen}
      />

      <div className="w-full bg-slate-800 rounded-md p-6">
        {label ? (
          <h2 className="py-1 mb-2 text-lg font-bold flex items-center justify-between gap-4">
            {url ? (
              <a
                className="text-sky-400 inline-flex items-center gap-1"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {label}
                <NewTabIcon />
              </a>
            ) : (
              <span className="text-sky-400">{label}</span>
            )}

            <div className="flex items-center gap-3">
              <span className="text-sm">TTFB</span>
              <GradeBreakdown data={data} />
            </div>
          </h2>
        ) : null}
        <div
          className={cn(
            'flex flex-col mb-4',
            'md:flex-row md:items-center md:justify-between'
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Server Delta</span>
                <span className="text-sm font-bold flex items-center gap-1">
                  {serverDelta} ms
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-60">
              <p dangerouslySetInnerHTML={{ __html: serverDeltaDesc }} />
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Avg TTFB</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <AvgShape color={avgGrade.color} /> {avg} ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">P75</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <P75Shape color={p75Grade.color} /> {p75} ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">P95</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <P95Shape color={p95Grade.color} /> {p95} ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">P99</span>
            <span className="text-sm font-bold flex items-center gap-1">
              <P99Shape color={p99gGrade.color} /> {p99} ms
            </span>
          </div>
        </div>

        <ReleaseTooltip />

        <div
          className="w-full"
          // NOTE! without a set height, the chart will not draw anything
          style={{ height: 500 }}
        >
          <ResponsiveContainer>
            <LineChart
              data={data.map(d => ({ ...d, createdAt: d.createdAt.getTime() }))}
              margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
              className="[&_.recharts-surface]:focus:outline-none"
            >
              <CartesianGrid strokeDasharray="5 5" stroke="#cccccc44" />
              <XAxis
                dataKey="createdAt"
                scale="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={value => (
                  <XTicks value={value} showTime={xTicks.showTime} />
                )}
                ticks={xTicks.ticks}
                stroke="#ccc"
                fill="#ccc"
                axisLine={false}
              />
              <YAxis
                type="number"
                stroke="#ccc"
                fill="#ccc"
                axisLine={false}
                tickFormatter={value => `${value} ms`}
                width={80}
              />
              <RechartsTooltip
                content={<CustomTooltip hideBullet />}
                cursor={{ strokeDasharray: '3 3' }}
                wrapperStyle={{ zIndex: 100 }}
              />
              <Line
                type="monotone"
                dataKey="ttfb"
                stroke="#ccc"
                dot={({ key, ...props }) => <TtfbDot key={key} {...props} />}
                activeDot={{
                  onClick: handleDotClick,
                  style: { cursor: 'pointer' },
                }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="timings.getWaSession"
                stroke="#ccc"
                dot={({ key, ...props }) => <ColoredDot key={key} {...props} />}
                activeDot={{
                  onClick: handleDotClick,
                  style: { cursor: 'pointer' },
                }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="timings.full_server_timing"
                stroke="#ccc"
                dot={({ key, ...props }) => <ColoredDot key={key} {...props} />}
                activeDot={{
                  onClick: handleDotClick,
                  style: { cursor: 'pointer' },
                }}
                isAnimationActive={false}
              />
              <ReleaseRefLines min={xTicks.min} max={xTicks.max} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default UserDataChart;
