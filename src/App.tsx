import { Header } from './components/Header'
import { LockScreen } from './components/LockScreen'
import { Dashboard } from './components/Dashboard'
import { Button } from './components/ui/Button'
import { VaultProvider, useVault } from './store/VaultContext'

function Shell() {
  const { status, lock } = useVault()
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        right={
          status === 'unlocked' ? (
            <Button variant="ghost" onClick={lock} aria-label="Travar">
              🔒 Travar
            </Button>
          ) : undefined
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6">
        {status === 'loading' && <p className="text-center text-muted">Carregando…</p>}
        {(status === 'locked' || status === 'first') && <LockScreen />}
        {status === 'unlocked' && <Dashboard />}
      </main>
      <footer className="border-t border-border py-4 text-center text-[11px] text-muted">
        100% local e criptografado · sem servidor · feito pra você
      </footer>
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
