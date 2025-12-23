import { formatMetricValue, getGrade, Grade } from '~/utils';
import Triangle from '~/components/Triangle';
import Circle from '~/components/Circle';
import Square from '~/components/Square';
import ScoreCircle from '~/components/ScoreCircle';

function MetricCard({ type, metric }) {
  const grade = getGrade(type, metric.value);
  let Shape = Circle;
  if (grade === Grade.Ok) Shape = Square;
  if (grade === Grade.Bad) Shape = Triangle;

  return (
    <div className="flex">
      <div>
        <Shape color={grade.color} />
      </div>
      <div className="ml-2">
        <div className="text-sm font-medium">{metric.label}</div>
        <div className="text-xl font-bold" style={{ color: grade.color }}>
          {formatMetricValue(type, metric.value)}
        </div>
      </div>
    </div>
  );
}

function TestScoreCode({ data }) {
  const metrics = {
    ttfb: { ...data.ttfb, label: 'Time to First Byte' },
    fcp: { ...data.fcp, label: 'First Contentful Paint' },
    speed_index: { ...data.speed_index, label: 'Speed Index' },
    tbt: { ...data.tbt, label: 'Total Blocking Time' },
    lcp: { ...data.lcp, label: 'Largest Contentful Paint' },
    cls: { ...data.cls, label: 'Cumulative Layout Shift' },
  };
  return (
    <div className="bg-slate-700 rounded-md p-8">
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        <h2 className="text-2xl font-bold">Performance</h2>
        <ScoreCircle score={data.performance} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([type, metric]) => (
          <MetricCard type={type} metric={metric} key={metric.label} />
        ))}
      </div>
    </div>
  );
}

export default TestScoreCode;
