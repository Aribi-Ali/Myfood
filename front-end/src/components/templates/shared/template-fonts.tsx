'use client'

/** Prefer document head links over inline @import to reduce FOUT and duplicate fetches. */
export function TemplateGoogleFonts({ hrefs }: { hrefs: string[] }) {
  const unique = [...new Set(hrefs.filter(Boolean))]
  if (unique.length === 0) return null
  return (
    <>
      {unique.map(href => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  )
}
