import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader } from './components/ui/card'

function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-semibold tracking-wide text-trust-blue-700">RTO Citizen Services</p>
          <p className="mt-1 text-sm text-slate-500">Driving Licence Application Portal</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          Service portal
        </span>
      </header>

      <section className="flex flex-1 items-center py-16">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <p className="text-sm font-semibold text-trust-blue-700">Online licence services</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Apply for a driving licence with confidence.
            </h1>
          </CardHeader>
          <CardContent>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              A secure, guided application experience for regional transport services. The application
              flow and administrator review tools will be added in the next phases.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button disabled>Start an application</Button>
              <Button variant="secondary" disabled>
                Track an application
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default App
