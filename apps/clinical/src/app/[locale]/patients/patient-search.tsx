'use client'

import { useState } from 'react'

interface PatientSearchProps {
  placeholder: string
}

export function PatientSearch({ placeholder }: PatientSearchProps) {
  const [query, setQuery] = useState('')

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-64 px-4 py-2 pl-10 rounded-lg border border-slate bg-white text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-petrol-60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  )
}
