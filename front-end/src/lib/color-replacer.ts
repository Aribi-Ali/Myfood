import { getColorMap } from './template-color-maps'
import { buildFontReverseMap } from './template-font-maps'

function hexToLower(hex: string): string {
  return hex.replace(/^#/, '').toLowerCase()
}

function expandHex(hex: string): string {
  if (hex.length === 3) return hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!
  return hex
}

function escapeRegex(s: string): string {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function replaceColorsWithCssVars(
  html: string,
  vars: Record<string, string>,
  templateSlug?: string
): string {
  // ─── 1. COLOR REPLACEMENT ───
  const hexToVar: Record<string, string> = {}

  for (const [varName, varValue] of Object.entries(vars)) {
    if (!varValue || typeof varValue !== 'string') continue
    const match = varValue.match(/^#?([0-9a-f]{3,8})$/i)
    if (match) {
      const hexVal = match[1]!; const expanded = expandHex(hexVal.toLowerCase())
      hexToVar[expanded] = varName
    }
  }

  if (templateSlug) {
    const templateMap = getColorMap(templateSlug)
    for (const [hex, varName] of Object.entries(templateMap)) {
      hexToVar[hexToLower(hex)] = varName
    }
  }

  let result = html

  if (Object.keys(hexToVar).length > 0) {
    const sortedHexes = Object.keys(hexToVar).sort((a, b) => b.length - a.length)
    const hexPattern = sortedHexes.map(escapeRegex).join('|')

    if (hexPattern) {
      // Tailwind arbitrary color values: text-[#xxx], bg-[#xxx], etc.
      result = result.replace(
        new RegExp(`(text|bg|border|fill|stroke|outline|ring|shadow|from|via|to|caret|accent|decoration|placeholder|divide)\\-(\\[)#?(${hexPattern})(\\])`, 'gi'),
        (_match, prefix: string, _bracket: string, hex: string) => {
          const varName = hexToVar[hexToLower(hex)]
          if (!varName) return _match
          return `${prefix}-[var(${varName})]`
        }
      )

      // Inline style color properties
      result = result.replace(
        /style="([^"]*)"/gi,
        (_match, content: string) => {
          const updated = content.replace(
            new RegExp(`((?:^|;)\\s*)(color|background(?:-color)?|border(?:-color)?|fill|stroke)\\s*:\\s*#(${hexPattern})([^;"]*)`, 'gi'),
            (_m: string, before: string, prop: string, hex: string, after: string) => {
              const varName = hexToVar[hexToLower(hex)]
              if (!varName) return _m
              return `${before}${prop}: var(${varName})${after}`
            }
          )
          return `style="${updated}"`
        }
      )
    }
  }

  // ─── 2. FONT REPLACEMENT ───
  if (templateSlug) {
    const fontReverse = buildFontReverseMap(templateSlug)

    if (Object.keys(fontReverse).length > 0) {
      // 2a. Inline style fontFamily: style="...font-family: 'Font Name', fallback..."
      result = result.replace(
        /style="([^"]*)"/gi,
        (_match, content: string) => {
          // Sort font entries by length descending to match longer strings first
          const sortedFonts = Object.entries(fontReverse).sort((a, b) => b[0].length - a[0].length)
          let updated = content
          for (const [fontStr, varName] of sortedFonts) {
            // Match font-family: <exact string> (case-insensitive)
            const pattern = new RegExp(
              `(font-family\\s*:\\s*(?:["']?)${escapeRegex(fontStr)}(?:["']?))([^;"]*)`,
              'gi'
            )
            updated = updated.replace(pattern, `font-family: var(${varName})$2`)
          }
          return `style="${updated}"`
        }
      )

      // 2b. Tailwind arbitrary font classes: font-['Font_Name']
      const sortedTwFonts = Object.entries(fontReverse).sort((a, b) => b[0].length - a[0].length)
      for (const [twToken, varName] of sortedTwFonts) {
        // Match font-['Token'] or font-["Token"] or font-[Token]
        const escapedToken = escapeRegex(twToken)
        result = result.replace(
          new RegExp(`font-\\[['"]?${escapedToken}['"]?\\]`, 'gi'),
          `font-[var(${varName})]`
        )
      }
    }
  }

  return result
}
