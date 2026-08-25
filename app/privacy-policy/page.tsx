import type { Metadata } from 'next'
import { getRequiredDoc } from '@/lib/markdown'
import { site } from '@/lib/site'
import Breadcrumbs from '@/components/Breadcrumbs'
import PendingBanner from '@/components/PendingBanner'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getRequiredDoc('pages', 'privacy-policy')
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: `${site.url}/privacy-policy/` },
    robots: doc.isPending ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function PrivacyPage() {
  const doc = await getRequiredDoc('pages', 'privacy-policy')
  const fm = doc.frontmatter

  return (
    <>
      {doc.isPending && <PendingBanner />}

      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy-policy/' },
          ]}
        />
      </div>

      <section className="section">
        <div className="wrap wrap-text">
          <h1>{fm.h1}</h1>
          <p className="lede">{String(fm.intro || '')}</p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
      </section>
    </>
  )
}
