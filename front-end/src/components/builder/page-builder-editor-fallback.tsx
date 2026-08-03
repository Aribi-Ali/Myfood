'use client'

export function PageBuilderEditorFallback() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[320px] p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 m-4">
      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-gray-700 font-semibold text-sm">Failed to load the editor</p>
      <p className="text-gray-400 text-xs mt-1.5 max-w-xs">
        Template or editor scripts may have failed to load. Reload to try again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200 cursor-pointer"
      >
        Reload editor
      </button>
    </div>
  )
}
