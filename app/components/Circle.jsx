export default function Circle(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
  );
}
