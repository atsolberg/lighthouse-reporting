import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import React from 'react';
import NewTabIcon from '~/icons/NewTabIcon';
import { getGrade, Grade } from '~/utils';
import Circle from '~/components/Circle';
import Square from '~/components/Square';
import Triangle from '~/components/Triangle';
import { cn } from '~/lib/utils';

const rails_timings = [
  'full_server_timing',
  'before_controller',
  'before_actions',
  'current_user',
];

function ReportModal({ report, open, onOpenChange }) {
  if (!report) return null;

  const grade = getGrade('ttfb', report.ttfb);
  let Shape = Circle;
  if (grade === Grade.Ok) Shape = Square;
  if (grade === Grade.Bad) Shape = Triangle;
  const createdAt = new Date(report.createdAt);
  const { rails, remix } = Object.entries(report.timings).reduce(
    (acc, [key, value]) => {
      if (rails_timings.includes(key)) {
        acc.rails.push({ name: key, value });
      } else {
        acc.remix.push({ name: key, value });
      }
      return acc;
    },
    { rails: [], remix: [] }
  );

  rails.sort((a, b) => {
    const k1 = a[Object.keys(a)[0]];
    const k2 = b[Object.keys(b)[0]];
    const listIndex1 = rails_timings.findIndex(t => t === k1);
    const listIndex2 = rails_timings.findIndex(t => t === k2);
    return listIndex1 - listIndex2;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle title={report.id}>Report Details</DialogTitle>
          <hr className="my-4" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {report?.region.toUpperCase()}
            </span>
            <span>-</span>
            <span>
              {createdAt.toLocaleDateString()}{' '}
              {createdAt
                .toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
                .toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="text-sky-500"
              href={report.target}
              target="_blank"
              rel="noreferrer"
            >
              {report.target} <NewTabIcon className="inline-block" />
            </a>
          </div>

          <hr className="my-4" />
          <h2 className="text-lg font-bold">Timings</h2>

          <div
            className={cn(
              'grid grid-cols-3 gap-y-1 gap-x-2',
              'items-center mt-2 text-sm '
            )}
            style={{ gridTemplateColumns: '2fr 1fr 4fr' }}
          >
            <div className="flex items-center gap-2">
              <span>TTFB</span> <Shape color={grade.color} />
            </div>
            <div className="text-right text-nowrap">
              {Math.round(report.ttfb)} ms
            </div>
            <div className="h-4 w-full bg-slate-300 rounded-xs"></div>
            <hr className="my-4" style={{ gridColumnStart: 'span 3' }} />
            {rails.map(timing => (
              <React.Fragment key={timing.name}>
                <div>{timing.name}</div>
                <div className="text-right text-nowrap">{timing.value} ms</div>
                <div
                  className="h-4 w-full bg-slate-300 rounded-xs"
                  style={{
                    width: `${(Number(timing.value) / Number(report.ttfb)) * 100}%`,
                  }}
                ></div>
              </React.Fragment>
            ))}

            <hr className="my-4" style={{ gridColumnStart: 'span 3' }} />

            {remix.map(timing => (
              <React.Fragment key={timing.name}>
                <div>{timing.name}</div>
                <div className="text-right text-nowrap">{timing.value} ms</div>
                <div
                  className="h-4 w-full bg-slate-300 rounded-xs"
                  style={{
                    width: `${(Number(timing.value) / Number(report.ttfb)) * 100}%`,
                  }}
                ></div>
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ReportModal;
