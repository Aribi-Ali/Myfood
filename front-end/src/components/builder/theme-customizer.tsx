'use client'

import { useState } from 'react'
import { THEME_PRESETS, type ThemeVariables } from '@/lib/themes'
import { useTheme } from './theme-provider'

const COLOR_KEYS: { key: keyof ThemeVariables; label: string }[] = [
  { key: '--color-primary', label: 'Primary' },
  { key: '--color-secondary', label: 'Secondary' },
  { key: '--color-accent', label: 'Accent' },
  { key: '--color-background', label: 'Background' },
  { key: '--color-surface', label: 'Surface' },
  { key: '--color-text-primary', label: 'Text' },
  { key: '--color-text-secondary', label: 'Text (Secondary)' },
  { key: '--color-text-muted', label: 'Text (Muted)' },
  { key: '--color-border', label: 'Border' },
]

const FONT_KEYS: { key: keyof ThemeVariables; label: string; options: string[] }[] = [
  {
    key: '--font-display', label: 'Heading Font',
    options: [
      "'Playfair Display', Georgia, serif",
      "'Inter', system-ui, sans-serif",
      "'DM Serif Display', Georgia, serif",
      "'Bebas Neue', 'Arial Black', sans-serif",
      "'Caveat', 'Playfair Display', cursive",
      "'Dancing Script', cursive",
      "'Fredoka One', sans-serif",
    ],
  },
  {
    key: '--font-body', label: 'Body Font',
    options: [
      "'Inter', system-ui, sans-serif",
      "'Playfair Display', Georgia, serif",
      "'DM Serif Display', Georgia, serif",
      "'Bebas Neue', 'Arial Black', sans-serif",
      "'Caveat', 'Playfair Display', cursive",
    ],
  },
]

const SPACING_KEYS: { key: keyof ThemeVariables; label: string }[] = [
  { key: '--radius-sm', label: 'Radius (Small)' },
  { key: '--radius-md', label: 'Radius (Medium)' },
  { key: '--radius-lg', label: 'Radius (Large)' },
  { key: '--btn-padding-x', label: 'Button Padding (X)' },
  { key: '--btn-padding-y', label: 'Button Padding (Y)' },
  { key: '--btn-radius', label: 'Button Radius' },
  { key: '--spacing-md', label: 'Spacing (Medium)' },
  { key: '--spacing-lg', label: 'Spacing (Large)' },
]

type Section = 'colors' | 'fonts' | 'spacing'

export function ThemeCustomizer() {
  const { preset, customVars, resolvedVars, applyPreset, setCustomVars, resetToPreset } = useTheme()
  const [activeSection, setActiveSection] = useState<Section>('colors')

  const sections: { id: Section; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'fonts', label: 'Fonts' },
    { id: 'spacing', label: 'Spacing' },
  ]

  const hasCustom = customVars !== null && Object.keys(customVars).length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b border-gray-200">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeSection === sec.id
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeSection === 'colors' && (
          <div className="space-y-4">
            {/* Preset swatches row */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Theme Presets</p>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className={`group relative w-9 h-9 rounded-xl border-2 transition-all cursor-pointer ${
                      preset.id === p.id
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-sm shadow-orange-100'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: p.previewColor }}
                    title={p.name}
                  >
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full text-[7px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
              {hasCustom && (
                <button
                  onClick={resetToPreset}
                  className="mt-2 text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Reset to Preset
                </button>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Colors</p>
              {COLOR_KEYS.map(({ key, label }) => (
                <ColorInput
                  key={key}
                  label={label}
                  value={resolvedVars[key]}
                  onChange={(val) => setCustomVars({ [key]: val })}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'fonts' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fonts</p>
            {FONT_KEYS.map(({ key, label, options }) => (
              <FontSelect
                key={key}
                label={label}
                value={resolvedVars[key]}
                options={options}
                onChange={(val) => setCustomVars({ [key]: val })}
              />
            ))}
          </div>
        )}

        {activeSection === 'spacing' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Spacing & Radius</p>
            {SPACING_KEYS.map(({ key, label }) => (
              <SpacingInput
                key={key}
                label={label}
                value={resolvedVars[key]}
                onChange={(val) => setCustomVars({ [key]: val })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 hover:border-gray-400 transition-colors"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-gray-600">{label}</p>
        <p className="text-[9px] font-mono text-gray-300 truncate">{value}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 text-[10px] font-mono rounded-lg border border-gray-200 px-2 py-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
      />
    </div>
  )
}

function FontSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white transition-all cursor-pointer"
        style={{ fontFamily: value }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ fontFamily: opt }}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function SpacingInput({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
        />
        <div className="flex gap-1">
          {['sm', 'md', 'lg'].map((size) => {
            const pxValue = size === 'sm' ? '4px' : size === 'md' ? '12px' : '24px'
            return (
              <button
                key={size}
                onClick={() => onChange(pxValue)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                  value === pxValue
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'text-gray-400 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
