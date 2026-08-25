import Link from 'next/link'
import { breadcrumbSchema } from '@/lib/schema'
import JsonLd from './JsonLd'

type Crumb = { name: string; path: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.path}>
            {i === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbSchema(items)} />
    </nav>
  )
}
