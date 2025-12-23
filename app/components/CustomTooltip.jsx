import { targetEnum } from '~/targets';
import { gradeFcp, gradeLcp, gradeScore, gradeTtfb } from '~/utils';
import { cn } from '~/lib/utils';

const stats = ['ttfb', 'lcp', 'fcp'];

/**
 * @param {{
 *  active: boolean;
 *  payload: Array<{
 *    dataKey: string;
 *    value: number:
 *    color: string;
 *    payload: Record<string, any>
 *  }>;
 *  label: number;
 * }} props
 */
function CustomTooltip({ active, payload, label, hideBullet }) {
  if (!active || !payload || !payload.length) return null;

  const region = payload[0]?.payload?.region;
  return (
    <div
      className={cn(
        'bg-black/80 rounded-md p-2',
        'text-sm text-white border border-gray-700'
      )}
    >
      <div className="mb-2">
        <div className="font-bold">{new Date(label).toLocaleString()}</div>
        {region ? (
          <div className="font-bold">{region.toUpperCase()}</div>
        ) : null}
      </div>
      <ul className="m-0 p-0 list-none">
        {payload.map((entry, index) => {
          const value = Math.round(Number(entry.value));
          const targetKey = entry.dataKey;
          const targetInfo = targetEnum[targetKey];
          let label = targetInfo ? targetInfo.label : targetKey;
          if (stats.includes(targetKey)) label = label.toUpperCase();

          let gradeFn = null;
          if (targetKey === 'score') gradeFn = gradeScore;
          if (targetKey === 'ttfb') gradeFn = gradeTtfb;
          if (targetKey === 'fcp') gradeFn = gradeFcp;
          if (targetKey === 'lcp') gradeFn = gradeLcp;

          let units = '';
          if (stats.includes(targetKey)) units = ' ms';
          if (targetKey.includes('timings.')) units = ' ms';

          return (
            <li
              key={`item-${index}`}
              className="flex items-center justify-between my-0.5 gap-2"
            >
              <span>
                {!hideBullet ? (
                  <span
                    className="inline-block w-2.5 h-2.5 mr-1.5"
                    style={{
                      color: entry.color,
                      backgroundColor: entry.color,
                    }}
                  />
                ) : null}
                <span style={{ flex: 1 }}>{label}</span>
              </span>
              <span
                className="font-bold"
                style={{ color: gradeFn?.(value)?.color || '#ccc' }}
              >
                {`${value}${units}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CustomTooltip;
