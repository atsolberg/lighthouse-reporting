import { Form } from 'react-router';

import useRootData from '~/hooks/useRootData';
import { gradeScore, scrollClasses } from '~/utils';
import { cn } from '~/lib/utils';

function ReportTable({ target, reports }) {
  const data = useRootData();
  return (
    <div>
      <h3
        className={cn(
          'pb-2 text-sm block font-bold',
          'border-b border-gray-500 text-gray-500'
        )}
      >
        <a
          href={target}
          target="_blank"
          className="text-xs text-sky-500"
          rel="noreferrer"
        >
          {target}
        </a>
        <br />
        Average:{' '}
        {Number(
          reports.reduce((acc, curr) => acc + curr.score, 0) / reports.length
        ).toFixed(1)}
      </h3>
      <div className={cn('max-h-[450px] overflow-y-auto', scrollClasses)}>
        <table data-target={target} className="w-full">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Score</th>
              <th className="px-2 py-1 text-left">TTFB</th>
              <th className="px-2 py-1 text-left">LCP</th>
              <th className="px-2 py-1 text-left">Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-top">
            {reports
              .sort((a, b) => {
                const aDate = new Date(a.createdAt);
                const bDate = new Date(b.createdAt);
                return bDate.getTime() - aDate.getTime();
              })
              .map(r => {
                const date = new Date(r.createdAt);
                return (
                  <tr key={r.id} className="group/row" title={r.id}>
                    <td
                      className="px-2 py-1 text-left"
                      style={{ color: gradeScore(r.score).color }}
                    >
                      {r.score}
                    </td>
                    <td className="px-2 py-1 text-left">{r.ttfb}ms</td>
                    <td className="px-2 py-1 text-left">{r.lcp}ms</td>
                    <td className="px-2 py-1 text-left">
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </td>
                    <td className="px-2 py-1 text-left"></td>
                    <td className="px-2 py-1 text-left">
                      <Form
                        method="DELETE"
                        className={data.isProd ? 'hidden' : ''}
                      >
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="invisible group-hover/row:visible cursor-pointer"
                        >
                          ❌
                        </button>
                      </Form>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportTable;
