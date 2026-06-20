import { useState } from 'react'
import { Header } from './components/Header'
import { LockScreen } from './components/LockScreen'
import { Dashboard } from './components/Dashboard'
import { SyncPanel } from './components/SyncPanel'
import { Button } from './components/ui/Button'
import { VaultProvider, useVault } from './store/VaultContext'

function Shell() {
  const { status, lock } = useVault()
  const [syncOpen, setSyncOpen] = useState(false)
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        right={
          status === 'unlocked' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setSyncOpen(true)}
                aria-label="Sincronizar"
                className="px-2.5 py-1.5"
              >
                ☁️
              </Button>
              <Button variant="ghost" onClick={lock} aria-label="Travar" className="px-2.5 py-1.5">
                🔒
              </Button>
            </div>
          ) : undefined
        }
      />
      {syncOpen && <SyncPanel onClose={() => setSyncOpen(false)} />}
      <main className="flex-1 overflow-hidden">
        {status === 'loading' && <p className="p-6 text-center text-muted">Carregando…</p>}
        {(status === 'locked' || status === 'first') && (
          <div className="scroll-area h-full overflow-y-auto px-4">
            <LockScreen />
          </div>
        )}
        {status === 'unlocked' && <Dashboard />}
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
