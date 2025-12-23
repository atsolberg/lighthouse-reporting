import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { targetEnum } from '~/targets';
import { generateXaxisTicks } from '~/utils';
import { getInitialShown } from '~/utils';

import XTicks from '~/components/XTicks';
import CustomTooltip from '~/components/CustomTooltip';
import Dot from '~/components/Dot';
import ReleaseRefLines from '~/components/ReleaseRefLines.jsx';

function sortByCreatedAt(a, b) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

/**
 * @param {{
 *   data: Record<string, Report>;
 *   targets: number[];
 * }} props
 */
const Chart = ({ data, targets: targetParams }) => {
  const allTargets = Object.keys(targetEnum);
  const shown = getInitialShown(allTargets, targetParams);

  // Prepare the data for Recharts and convert createdAt to Unix timestamp
  const filteredTargets = allTargets.filter(t => shown[t]);
  const chartData = filteredTargets.map(key => {
    return (data[key] || []).sort(sortByCreatedAt).map(entry => {
      return {
        name: entry.createdAt.getTime(), // Convert to Unix timestamp
        [key]: entry.score,
        stroke: targetEnum[key].color,
        createdAt: entry.createdAt,
        id: entry.id,
      };
    });
  });

  // Flatten chart data for processing
  const flat = chartData.flat();
  const xTicks = generateXaxisTicks(flat);

  return (
    <div
      className="w-full bg-slate-800 rounded-md px-2 py-10"
      // NOTE! without a set height, the chart will not draw anything
      style={{ height: 500 }}
    >
      <ResponsiveContainer>
        <LineChart
          data={flat}
          margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          className="[&_.recharts-surface]:focus:outline-none"
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#cccccc44" />
          <XAxis
            dataKey="name"
            type="number"
            domain={['auto', 'auto']}
            scale="linear"
            tick={value => <XTicks value={value} showTime={xTicks.showTime} />}
            ticks={xTicks.ticks}
            stroke="#ccc"
            fill="#ccc"
          />
          <YAxis domain={[0, 100]} stroke="#ccc" fill="#ccc" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3' }}
            wrapperStyle={{ zIndex: 100 }}
          />
          {filteredTargets.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key}
              stroke={targetEnum[key].color}
              dot={Dot}
              isAnimationActive={false}
            />
          ))}
          <ReleaseRefLines min={xTicks.min} max={xTicks.max} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
