import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { targetEnum } from '~/targets';
import { generateXaxisTicks } from '~/utils';
import { cn } from '~/lib/utils';

import XTicks from '~/components/XTicks';
import CustomTooltip from '~/components/CustomTooltip';
import { FcpDot, LcpDot, ScoreDot, TtfbDot } from '~/components/Dot';
import { ReleaseProvider } from '~/components/ReleasesProvider.jsx';
import ReleaseTooltip from '~/components/ReleaseTooltip.jsx';
import ReleaseRefLines from '~/components/ReleaseRefLines.jsx';

const target_entries = Object.entries(targetEnum);

export default function Component() {
  const targets = target_entries.map(([path, data]) => ({ path, ...data }));
  const [target, setTarget] = React.useState(targets[0]);
  const [data, setData] = React.useState([]);
  const xTicks = generateXaxisTicks(data, 'createdAt');

  React.useEffect(() => {
    fetch('/api/stats?target=' + target.path)
      .then(res => res.json())
      .then(res =>
        setData(
          res.reports.map(r => ({
            ...r,
            createdAt: new Date(r.createdAt).getTime(),
          }))
        )
      );
  }, [target.path]);

  return (
    <ReleaseProvider>
      <ReleaseTooltip />
      <main className="container px-4 mx-auto relative min-h-screen">
        <section className="mt-4">
          <h1 className="text-2xl font-bold mb-4 flex items-center justify-between gap-2">
            <span>Report Stats</span>
            <select
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
        </section>

        <section className="mt-4">
          <h2 className="text-md font-bold mb-4">Lighthouse Score</h2>
          {data.length ? (
            <div
              className="w-full bg-slate-800 rounded-md px-2 py-10"
              // NOTE! without a set height, the chart will not draw anything
              style={{ height: 500 }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={data}
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
                    domain={[0, 100]}
                    stroke="#ccc"
                    fill="#ccc"
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    content={<CustomTooltip hideBullet />}
                    cursor={{ strokeDasharray: '3 3' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#ccc"
                    dot={ScoreDot}
                    isAnimationActive={false}
                  />
                  <ReleaseRefLines min={xTicks.min} max={xTicks.max} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="mt-4 mb-4 text-md font-bold">TTFB / FCP / LCP</h2>
          {data.length ? (
            <div
              className="w-full bg-slate-800 rounded-md px-2 py-10"
              // NOTE! without a set height, the chart will not draw anything
              style={{ height: 500 }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={data}
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
                  <Tooltip
                    content={<CustomTooltip hideBullet />}
                    cursor={{ strokeDasharray: '3 3' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ttfb"
                    stroke="#ccc"
                    dot={TtfbDot}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="fcp"
                    stroke="#ccc"
                    dot={FcpDot}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="lcp"
                    stroke="#ccc"
                    dot={LcpDot}
                    isAnimationActive={false}
                  />
                  <ReleaseRefLines min={xTicks.min} max={xTicks.max} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </section>
      </main>
    </ReleaseProvider>
  );
}
