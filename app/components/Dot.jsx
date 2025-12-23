import { gradeFcp, gradeLcp, gradeScore, gradeTtfb } from '~/utils';

export function ColoredDot({ value, color = 'currentColor', ...rest }) {
  return (
    <circle
      r={1} // Marker size
      stroke={color}
      strokeWidth={3} // Marker stroke width
      fill={color}
      className={!value ? 'hidden' : ''}
      width={rest.width}
      height={rest.height}
      cx={rest.cx}
      cy={rest.cy}
      {...(rest.onClick ? { onClick: rest.onClick } : {})}
    />
  );
}

/**
 * @param {{ createdAt: Date }} payload
 * @param {number} value
 * @param {string} dataKey
 */
export function ScoreDot({ payload, value, ...rest }) {
  const color = gradeScore(payload.score).color;
  return <ColoredDot payload={payload} value={value} color={color} {...rest} />;
}

/**
 * @param {{ createdAt: Date }} payload
 * @param {number} value
 * @param {string} dataKey
 */
export function TtfbDot({ payload, value, ...rest }) {
  const color = gradeTtfb(payload.ttfb).color;
  return <ColoredDot payload={payload} value={value} color={color} {...rest} />;
}

/**
 * @param {{ createdAt: Date }} payload
 * @param {number} value
 * @param {string} dataKey
 */
export function FcpDot({ payload, value, ...rest }) {
  const color = gradeFcp(payload.fcp).color;
  return <ColoredDot payload={payload} value={value} color={color} {...rest} />;
}

/**
 * @param {{ createdAt: Date }} payload
 * @param {number} value
 * @param {string} dataKey
 */
export function LcpDot({ payload, value, ...rest }) {
  const color = gradeLcp(payload.lcp).color;
  return <ColoredDot payload={payload} value={value} color={color} {...rest} />;
}

/**
 * @param {{ createdAt: Date }} payload
 * @param {number} value
 * @param {string} dataKey
 */
function Dot({ payload, value, dataKey, ...rest }) {
  return (
    <circle
      key={payload.id}
      data-key={dataKey}
      data-id={payload.id}
      data-value={value}
      data-timestamp={payload.createdAt.getTime()}
      r={1} // Marker size
      stroke={rest.stroke}
      strokeWidth={2} // Marker stroke width
      fill={rest.stroke}
      className={!value ? 'hidden' : ''}
      width={rest.width}
      height={rest.height}
      cx={rest.cx}
      cy={rest.cy}
    />
  );
}

export default Dot;
