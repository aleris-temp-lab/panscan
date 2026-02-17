'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface RetroThemeContextType {
  isRetro: boolean
  toggleRetro: () => void
}

const RetroThemeContext = createContext<RetroThemeContextType>({
  isRetro: false,
  toggleRetro: () => {},
})

export function useRetroTheme() {
  return useContext(RetroThemeContext)
}

export function RetroThemeProvider({ children }: { children: ReactNode }) {
  const [isRetro, setIsRetro] = useState(false)

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem('panscan-retro-mode')
    if (saved === 'true') {
      setIsRetro(true)
    }
  }, [])

  useEffect(() => {
    // Apply/remove retro class on body
    if (isRetro) {
      document.documentElement.classList.add('retro-mode')
      localStorage.setItem('panscan-retro-mode', 'true')
    } else {
      document.documentElement.classList.remove('retro-mode')
      localStorage.setItem('panscan-retro-mode', 'false')
    }
  }, [isRetro])

  const toggleRetro = () => setIsRetro(prev => !prev)

  return (
    <RetroThemeContext.Provider value={{ isRetro, toggleRetro }}>
      {children}
    </RetroThemeContext.Provider>
  )
}
