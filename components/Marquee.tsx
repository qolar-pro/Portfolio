export function Marquee({ items }: { items: string[] }) {
  // Two identical tracks so the loop is seamless.
  const track = (key: string) => (
    <div className="marquee-track" key={key} aria-hidden={key === 'b'}>
      {items.map((t) => (
        <i key={t}>{t}</i>
      ))}
    </div>
  );

  return (
    <div className="marquee" role="presentation">
      {track('a')}
      {track('b')}
    </div>
  );
}
