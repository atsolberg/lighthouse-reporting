export default function Triangle(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <polygon points="12,3 21,21 3,21" fill="currentColor" />
    </svg>
  );
}
