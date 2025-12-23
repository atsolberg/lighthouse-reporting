import { cn } from '~/lib/utils';

import { useReleases } from '~/components/ReleasesProvider';

/** Tooltip layer for Release markers (placed above chart wrapper) */
export default function ReleaseTooltip() {
  const { releaseTip } = useReleases();
  const { commit, x, y } = releaseTip;
  const ts = commit?.timestamp ? new Date(commit.timestamp) : null;
  const tsText = ts ? ts.toLocaleString() : 'Unknown date';
  const message = commit?.message ?? 'No message';
  const sha = commit?.sha ? String(commit.sha) : '';
  const shortSha = sha ? sha.slice(0, 7) : 'unknown';

  return (
    <div className="relative">
      {releaseTip.show ? (
        <div
          style={{
            position: 'fixed',
            top: y + 12,
            left: x + 12,
            zIndex: 1000,
          }}
          className={cn(
            'pointer-events-none',
            'max-w-xs',
            'rounded-md',
            'border border-sky-500 ',
            'bg-slate-900/90',
            'px-3 py-2',
            'text-xs text-slate-100',
            'shadow-lg'
          )}
        >
          <div className="font-medium text-sky-300 mb-1">Release</div>
          <div className="whitespace-pre-wrap break-words">
            <div>{tsText}</div>
            <div className="text-slate-200">{message}</div>
            <div className="text-slate-400">SHA: {shortSha}</div>
            <div className="text-slate-400">Author: {commit.author}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
