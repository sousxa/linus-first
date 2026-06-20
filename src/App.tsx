import { useState } from 'react'
import { Cloud, Lock } from 'lucide-react'
import { Header } from './components/Header'
import { LockScreen } from './components/LockScreen'
import { Home } from './components/Home'
import { SectionScreen } from './components/SectionScreen'
import { DesktopDashboard } from './components/layout/DesktopDashboard'
import { SyncPanel } from './components/SyncPanel'
import { Button } from './components/ui/Button'
import { useMediaQuery } from './hooks/useMediaQuery'
import { NAV, type View } from './components/navConfig'
import { VaultProvider, useVault } from './store/VaultContext'

function Shell() {
  const { status, lock } = useVault()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [view, setView] = useState<View>('home')
  const [syncOpen, setSyncOpen] = useState(false)

  const inSection = status === 'unlocked' && !isDesktop && view !== 'home'
  const sectionTitle = NAV.find((n) => n.id === view)?.label

  const right =
    status === 'unlocked' ? (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setSyncOpen(true)}
          aria-label="Sincronizar"
          className="px-2.5 py-1.5"
        >
          <Cloud size={18} />
        </Button>
        <Button variant="ghost" onClick={lock} aria-label="Travar" className="px-2.5 py-1.5">
          <Lock size={18} />
        </Button>
      </div>
    ) : undefined

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        title={inSection ? sectionTitle : undefined}
        onBack={inSection ? () => setView('home') : undefined}
        right={right}
      />
      {syncOpen && <SyncPanel onClose={() => setSyncOpen(false)} />}
      <main className="flex-1 overflow-hidden">
        {status === 'loading' && <p className="p-6 text-center text-muted">Carregando…</p>}
        {(status === 'locked' || status === 'first') && (
          <div className="scroll-area h-full overflow-y-auto px-4">
            <LockScreen />
          </div>
        )}
        {status === 'unlocked' &&
          (isDesktop ? (
            <DesktopDashboard />
          ) : view === 'home' ? (
            <Home onNavigate={setView} />
          ) : (
            <SectionScreen view={view} />
          ))}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <VaultProvider>
      <Shell />
    </VaultProvider>
  )
}
