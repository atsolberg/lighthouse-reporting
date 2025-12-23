import { getUserData } from '~/models/user-data';
import {
  useLoaderData,
  useRevalidator,
  useSearchParams,
  useSubmit,
} from 'react-router';
import UserDataChart from '~/components/UserDataChart';
import Switch from '~/components/Switch';
import React from 'react';
import { cn } from '~/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';

import { ReleaseProvider } from '~/components/ReleasesProvider';

const CHART_OPTIONS = [
  { key: 'page', label: 'Page' },
  { key: 'region', label: 'Region' },
];

const RANGE_OPTIONS = [
  { key: '2h', label: '2 hours', ms: 2 * 60 * 60 * 1000 },
  { key: '6h', label: '6 hours', ms: 6 * 60 * 60 * 1000 },
  { key: '1d', label: '1 day', ms: 1 * 24 * 60 * 60 * 1000 },
  { key: '2d', label: '2 days', ms: 2 * 24 * 60 * 60 * 1000 },
  { key: '3d', label: '3 days', ms: 3 * 24 * 60 * 60 * 1000 },
  { key: '4d', label: '4 days', ms: 4 * 24 * 60 * 60 * 1000 },
  { key: '5d', label: '5 days', ms: 5 * 24 * 60 * 60 * 1000 },
  { key: '6d', label: '6 days', ms: 6 * 24 * 60 * 60 * 1000 },
  { key: '7d', label: '7 days', ms: 7 * 24 * 60 * 60 * 1000 },
];

function getChartTypeFromParams(searchParams) {
  const param = searchParams.get('chart-by');
  if (param && CHART_OPTIONS.find(o => o.key === param)) return param;
  return CHART_OPTIONS[0].key;
}

function getRangeFromParams(searchParams) {
  const param = searchParams.get('range');
  if (param && RANGE_OPTIONS.find(o => o.key === param)) return param;
  return RANGE_OPTIONS[0].key;
}

export async function loader({ request }) {
  const { searchParams } = new URL(request.url);

  const chartType = getChartTypeFromParams(searchParams);
  const chartBy = chartType === 'page' ? 'target' : 'region';
  const rangeKey = getRangeFromParams(searchParams);
  const opt = RANGE_OPTIONS.find(o => o.key === rangeKey) ?? RANGE_OPTIONS[0];

  let data = await getUserData(Date.now(), opt.ms);

  data = data.reverse().reduce((acc, cur) => {
    let list = acc[cur[chartBy]];
    if (!list) {
      list = [];
      acc[cur[chartBy]] = list;
    }
    list.push(cur);
    return acc;
  }, {});

  return { data };
}

export default function Component() {
  const { data } = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const chartType = getChartTypeFromParams(searchParams);
  const rangeKey = getRangeFromParams(searchParams);
  const paramIndex = RANGE_OPTIONS.findIndex(o => o.key === rangeKey);
  const initialIndex = Math.max(0, paramIndex);

  // Local state to manage slider value during interaction (index into RANGE_OPTIONS)
  const [sliderValue, setSliderValue] = React.useState(initialIndex);

  // Sync sliderValue with params when search params change
  React.useEffect(() => {
    const idx = RANGE_OPTIONS.findIndex(
      o => o.key === getRangeFromParams(searchParams)
    );
    setSliderValue(idx === -1 ? 0 : idx);
  }, [searchParams]);

  // Handle slider change during drag
  function handleSliderChange(event) {
    setSliderValue(Number.parseInt(event.target.value, 10));
  }

  function handleChartTypeChange(value) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('chart-by', value);
    // Trigger loader with new search params without navigating
    submit(newSearchParams, { replace: true });
  }

  // Handle slider release (mouse up or touch end)
  const handleSliderRelease = event => {
    const newIndex = Number.parseInt(event.target.value, 10);
    const newRange = RANGE_OPTIONS[newIndex]?.key ?? '2h';
    // Create new search params with updated 'range'
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('range', newRange);
    // Trigger loader with new search params without navigating
    submit(newSearchParams, { replace: true });
  };

  const [live, setLive] = React.useState(false);
  const [recentlyUpdate, setRecentlyUpdated] = React.useState(false);

  /** Revalidate (re-fetch loader data) every 15 seconds if 'Live' is on */
  const revalidator = useRevalidator();
  React.useEffect(() => {
    let cleanup = () => {};

    if (live) {
      const intervalId = setInterval(revalidator.revalidate, 10000);
      setRecentlyUpdated(Date.now());
      setTimeout(() => {
        setRecentlyUpdated(false);
      }, 2000);
      cleanup = () => clearInterval(intervalId);
    }

    return cleanup;
  }, [live, revalidator]);

  return (
    <main className="container px-4 mx-auto relative min-h-screen">
      <section className="mt-4">
        <h1 className="text-2xl font-bold mb-4">User Data</h1>
        <p className="mb-10">
          Data from a sampling of real mobile users, showing ttfb, and server
          timings.
        </p>
        {/* CONTROLS */}
        <div className="flex items-center justify-end gap-6 mb-4">
          {/* LIVE TOGGLE */}
          <span
            className="flex items-center gap-2 text-sm mr-1"
            title="Fetch new data every 10 seconds"
          >
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'relative inline-flex',
                  (!live || !recentlyUpdate) && 'invisible'
                )}
              >
                <span
                  className={cn(
                    'animate-ping',
                    'absolute inline-flex',
                    'bg-sky-400',
                    'rounded-full',
                    'h-3.5 w-3.5',
                    'opacity-75'
                  )}
                ></span>
                <span
                  className={cn(
                    'inline-block h-3.5 w-3.5',
                    'bg-sky-500',
                    'rounded-full',
                    'text-sky-100 text-xs',
                    'py-px px-px',
                    'z-1'
                  )}
                >
                  &nbsp;&nbsp;
                </span>
              </span>
              <b>Live</b>
            </span>
            <Switch
              theme="admin"
              checked={live}
              onChange={() => setLive(!live)}
            />
          </span>

          {/* CHART BY */}
          <div className="flex items-center gap-3">
            <label htmlFor="chart-type" className="text-sm font-bold">
              Chart By
            </label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={chartType}
              onValueChange={handleChartTypeChange}
            >
              <ToggleGroupItem value="page" className="cursor-pointer">
                Page
              </ToggleGroupItem>
              <ToggleGroupItem value="region" className="cursor-pointer">
                Region
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* TIME RANGE SLIDER */}
          <div className="flex items-center gap-3 text-sm font-bold">
            <label htmlFor="range-slider">
              Last {RANGE_OPTIONS[sliderValue]?.label}
            </label>
            <input
              id="range-slider"
              type="range"
              min="0"
              max={(RANGE_OPTIONS.length - 1).toString()}
              step="1"
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              className={cn(
                'h-2 rounded-lg',
                'appearance-none cursor-pointer',
                'bg-gray-700'
              )}
            />
          </div>
        </div>

        {/* CHARTS */}
        <ReleaseProvider>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(data)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([chartField, data]) => (
                <UserDataChart
                  key={chartField}
                  chartField={chartField}
                  chartType={chartType}
                  data={data}
                />
              ))}
          </div>
        </ReleaseProvider>
      </section>
    </main>
  );
}
