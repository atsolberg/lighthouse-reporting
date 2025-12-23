import React from 'react';

function TestDetailsCard({ runs }) {
  return (
    <div>
      {runs.map((run, i) => (
        <div key={i} className="not-last:mb-4 p-4 bg-slate-700 rounded-md">
          <h4 className="text-md font-bold border-b border-slate-600 pb-2">
            Run {i + 1}
          </h4>
          <div className="text-sm grid grid-cols-3 gap-y-1 mt-2">
            <div>TTFB</div>
            <div>{Math.round(run.ttfb)} ms</div>
            <div className="h-4 w-full bg-slate-300 rounded-xs"></div>
            {Object.entries(run.timings).map(([k, v]) => (
              <React.Fragment key={k}>
                <div>{k}</div>
                <div>{v} ms</div>
                <div
                  className="h-4 w-full bg-slate-300 rounded-xs"
                  style={{
                    width: `${(Number(v) / Number(run.ttfb)) * 100}%`,
                  }}
                ></div>
              </React.Fragment>
            ))}
          </div>

          <hr className="my-4 text-slate-600" />

          <div className="text-sm grid grid-cols-2 gap-y-1">
            <div>Cloudfront Region</div>
            <div>{run.cf_reg}</div>
            <div>Fly Region</div>
            <div>{run.fly_region}</div>
            <div>Fly Machine</div>
            <div>{run.fly_machine_id}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TestDetailsCard;
