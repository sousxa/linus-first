import { Header } from './components/Header'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-lg font-semibold">Painel em construção 🛠️</p>
          <p className="mt-1 text-muted">As seções financeiras chegam pelos próximos PRs.</p>
        </div>
      </main>
      <footer className="border-t border-border py-4 text-center text-[11px] text-muted">
        100% local e criptografado · sem servidor · feito pra você
      </footer>
    </div>
  )
}
