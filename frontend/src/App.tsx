import { ApplicationWizard } from './features/applications/components/application-wizard'

function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 sm:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-trust-blue-700">RTO Citizen Services</p>
          <p className="mt-1 text-sm text-slate-500">Driving Licence Application Portal</p>
        </div>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
          Secure online service
        </span>
      </header>
      <section className="flex justify-center py-12 sm:py-16">
        <ApplicationWizard />
      </section>
    </main>
  )
}

export default App
