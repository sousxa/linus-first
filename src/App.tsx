import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Header } from './components/Header'
import { LockScreen } from './components/LockScreen'
import { Home } from './components/Home'
import { SectionScreen } from './components/SectionScreen'
import { ConfigScreen } from './components/ConfigScreen'
import { DesktopDashboard } from './components/layout/DesktopDashboard'
import { Modal } from './components/ui/Modal'
import { Button } from './components/ui/Button'
import { useMediaQuery } from './hooks/useMediaQuery'
import { NAV, type View } from './components/navConfig'
import { VaultProvider, useVault } from './store/VaultContext'

function Shell() {
  const { status } = useVault()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [view, setView] = useState<View>('home')
  const [configOpen, setConfigOpen] = useState(false)

  const inSection = status === 'unlocked' && !isDesktop && view !== 'home'
  const sectionTitle = view === 'config' ? 'Config' : NAV.find((n) => n.id === view)?.label

  function openConfig() {
    if (isDesktop) setConfigOpen(true)
    else setView('config')
  }

  const right =
    status === 'unlocked' ? (
      <Button variant="ghost" onClick={openConfig} aria-label="Config" className="px-2.5 py-1.5">
        <Settings size={18} />
      </Button>
    ) : undefined

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        title={inSection ? sectionTitle : undefined}
        onBack={inSection ? () => setView('home') : undefined}
        right={right}
      />
      {configOpen && (
        <Modal title="Config" onClose={() => setConfigOpen(false)}>
          <ConfigScreen />
        </Modal>
      )}
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
