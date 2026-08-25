/**
 * Renders a JSON-LD block. Schema objects are built in lib/schema.ts so the
 * shape stays in one place and cannot drift page to page.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
