import DOMPurify from 'dompurify'

const purify = typeof window !== 'undefined' ? DOMPurify(window) : null

export function sanitizeHtml(html: string): string {
  if (!purify) return html
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'u', 'em', 'strong', 'a', 'img',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'div', 'span', 'section', 'header', 'footer',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption', 'picture', 'source',
      'button', 'svg', 'path', 'circle', 'use',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class', 'id',
      'width', 'height', 'loading', 'srcset', 'sizes',
      'data-*',
    ],
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ['target'],
  })
}
