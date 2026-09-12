/**
 * One place that writes a JSON-LD block.
 *
 * The escape matters more than it looks: `<` is the only character that can
 * close a <script> element from inside a JSON string, so a stray "</script>"
 * in any piece of copy would end the block early and dump the rest of the
 * graph into the page as text. Escaping it to < is still valid JSON and
 * still parses for a crawler.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
