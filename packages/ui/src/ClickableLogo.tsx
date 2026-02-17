'use client'

import { Logo, LogoProps } from './Logo'
import { useRetroTheme } from './RetroTheme'

export function ClickableLogo(props: LogoProps) {
  const { toggleRetro, isRetro } = useRetroTheme()

  return (
    <button
      onClick={toggleRetro}
      className="transition-transform hover:scale-105 active:scale-95"
      title={isRetro ? 'Back to modern' : 'Try retro mode!'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <Logo {...props} />
    </button>
  )
}
