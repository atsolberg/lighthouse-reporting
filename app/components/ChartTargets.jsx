import { getInitialShown } from '~/utils';
import { targetEnum } from '~/targets';
import { cn } from '~/lib/utils';

function ChartTargets({ targets: targetParams }) {
  const allTargets = Object.keys(targetEnum);
  const shown = getInitialShown(allTargets, targetParams);

  const groups = allTargets
    .sort((a, b) => {
      const { pathname: pa } = new URL(a);
      const { pathname: pb } = new URL(b);
      return pa.localeCompare(pb);
    })
    .reduce((acc, target) => {
      const queryIndex = target.indexOf('?');
      let path = target;
      if (queryIndex > 0) path = target.substring(0, queryIndex);

      let group = acc[path];
      if (!group) {
        acc[path] = [];
        group = acc[path];
      }
      group.push(target);
      return acc;
    }, {});

  return (
    <div
      className={cn(
        'px-4 py-2 bg-slate-800 rounded-md mt-8',
        'border border-gray-900',
        'lg:mt-0 lg:h-full'
      )}
    >
      <h3 className="text-sm font-bold mb-3">Pages</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        {Object.values(groups).map(group => (
          <div key={group.join('->')}>
            {group
              .map(t => [t, targetEnum[t]])
              .map(([t, target]) => (
                <div key={target.id}>
                  <label className="cursor-pointer" title={t}>
                    <input
                      type="checkbox"
                      name="t[]"
                      value={target.id}
                      defaultChecked={shown[t]}
                    />
                    <span className="ml-1" style={{ color: target.color }}>
                      {target.label}
                    </span>
                  </label>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChartTargets;
