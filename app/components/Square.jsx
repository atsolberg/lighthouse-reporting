export default function Square(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" fill="currentColor" />
    </svg>
  );
}
