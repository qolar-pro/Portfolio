export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M4 12h17l4.2 4.2-4.2 1.4h-1.6l-3.3 5.2 3.8 2.3v1.4H11v-1.4l3.8-2.3-3.3-5.2H9.6L4 16.2V12Z"
        fill="currentColor"
      />
      <path d="M23.2 4.6l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2L18.8 9l3.2-1.2z" fill="#ff6a13" />
    </svg>
  );
}
