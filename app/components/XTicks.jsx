function XTicks(props) {
  const value = props.value.payload.value;
  const { x, y } = props.value;
  const date = new Date(value);
  const day = date.toLocaleDateString();
  const time = date
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#ccc">
        {day}
      </text>
      {props.showTime ? (
        <text x={0} y={16} dy={16} textAnchor="middle" fill="#ccc">
          {time}
        </text>
      ) : null}
    </g>
  );
}

export default XTicks;
