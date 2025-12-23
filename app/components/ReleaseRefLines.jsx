import { ReferenceLine } from 'recharts';
import colors from 'tailwindcss/colors';
import { useReleases } from '~/components/ReleasesProvider';

const sky_500 = colors.sky['500'];

/**
 * Custom label for Recharts ReferenceLine.
 * Shows a blue "Release" SVG label.
 * Hover events are lifted to the parent so the parent can render a tooltip.
 */
function ReleaseMarker({ commit, onEnter, onLeave, onMove, ...props }) {
  const x = props?.viewBox?.x ?? props?.x ?? 0;
  const y = (props?.viewBox?.y ?? props?.y ?? 0) + 10;

  function handleEnter() {
    if (onEnter) onEnter(commit);
  }
  function handleLeave() {
    if (onLeave) onLeave();
  }
  function handleMove(e) {
    if (onMove) onMove({ x: e.clientX, y: e.clientY });
  }

  return (
    <g
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className="cursor-pointer"
      onClick={() => {
        window.open(commit.html_url, '_blank');
      }}
    >
      <circle
        r={4}
        cx={x}
        cy={y - 18}
        fill={sky_500}
        className="pointer-events-auto"
      />
    </g>
  );
}

function ReleaseRefLines({ min, max }) {
  const { setReleaseTip, commitsByTs } = useReleases();

  function handleReleaseEnter(commit) {
    setReleaseTip(prev => ({ ...prev, show: true, commit }));
  }
  function handleReleaseLeave() {
    setReleaseTip(prev => ({ ...prev, show: false }));
  }
  function handleReleaseMove(pos) {
    setReleaseTip(prev => ({ ...prev, x: pos.x, y: pos.y }));
  }

  return (
    <>
      {Object.entries(commitsByTs)
        .filter(([k]) => {
          const ts = Number(k);
          return ts >= min && ts <= max;
        })
        .map(([k, commit]) => {
          const ts = Number(k);
          return (
            <ReferenceLine
              key={ts}
              x={ts}
              stroke={sky_500}
              strokeWidth={1}
              strokeDasharray="3 3"
              ifOverflow="visible"
              label={
                <ReleaseMarker
                  commit={commit}
                  onEnter={handleReleaseEnter}
                  onLeave={handleReleaseLeave}
                  onMove={handleReleaseMove}
                />
              }
            />
          );
        })}
    </>
  );
}

export default ReleaseRefLines;
