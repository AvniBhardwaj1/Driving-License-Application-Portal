import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { VEHICLE_CATEGORIES } from '../eligibility'
import { useAgeEligibility } from '../hooks/use-age-eligibility'
import { useApplicationWizard } from '../hooks/use-application-wizard'

const stepLabels = ['Personal details', 'Vehicle eligibility', 'Review application']

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  ) : null
}

function formatDate(date: string) {
  if (!date) return 'Not provided'

  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  )
}

export function ApplicationWizard() {
  const wizard = useApplicationWizard()
  const ageEligibility = useAgeEligibility(wizard.draft.dateOfBirth)

  if (wizard.submissionState === 'success' && wizard.submittedApplication) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <p className="text-sm font-semibold text-emerald-700">Application received</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Your application is pending review.
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Keep this reference number for your records: {' '}
            <span className="font-semibold text-slate-900">{wizard.submittedApplication.id}</span>
          </p>
          <Button className="mt-8" onClick={wizard.startAnotherApplication}>
            Start another application
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <p className="text-sm font-semibold text-trust-blue-700">Driving licence application</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Apply in three simple steps.
        </h1>
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {stepLabels.map((label, index) => {
            const isCurrentStep = index === wizard.step
            const isComplete = index < wizard.step
            return (
              <li
                className={[
                  'rounded-md border px-3 py-2 text-sm font-medium',
                  isCurrentStep
                    ? 'border-trust-blue-600 bg-trust-blue-50 text-trust-blue-800'
                    : isComplete
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'bg-slate-50 text-slate-500',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={label}
              >
                <span className="mr-2">{index + 1}.</span>
                {label}
              </li>
            )
          })}
        </ol>
      </CardHeader>

      <CardContent>
        {wizard.submissionState === 'error' && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            {wizard.submissionError}
          </div>
        )}

        {wizard.step === 0 && (
          <section aria-labelledby="personal-details-heading">
            <h2 className="text-lg font-semibold text-slate-950" id="personal-details-heading">
              Personal details
            </h2>
            <p className="mt-1 text-sm text-slate-600">Use the details shown on your identity document.</p>
            <div className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="full-name">
                Full name
                <Input
                  aria-invalid={Boolean(wizard.errors.fullName)}
                  className="mt-2"
                  id="full-name"
                  onChange={(event) => wizard.updateField('fullName', event.target.value)}
                  value={wizard.draft.fullName}
                />
                <FieldError message={wizard.errors.fullName} />
              </label>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
                <Input
                  aria-invalid={Boolean(wizard.errors.email)}
                  className="mt-2"
                  id="email"
                  onChange={(event) => wizard.updateField('email', event.target.value)}
                  type="email"
                  value={wizard.draft.email}
                />
                <FieldError message={wizard.errors.email} />
              </label>
              <label className="block text-sm font-medium text-slate-700" htmlFor="date-of-birth">
                Date of birth
                <Input
                  aria-invalid={Boolean(wizard.errors.dateOfBirth)}
                  className="mt-2"
                  id="date-of-birth"
                  onChange={(event) => wizard.updateField('dateOfBirth', event.target.value)}
                  type="date"
                  value={wizard.draft.dateOfBirth}
                />
                <FieldError message={wizard.errors.dateOfBirth} />
              </label>
            </div>
          </section>
        )}

        {wizard.step === 1 && (
          <section aria-labelledby="vehicle-eligibility-heading">
            <h2 className="text-lg font-semibold text-slate-950" id="vehicle-eligibility-heading">
              Vehicle eligibility
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {ageEligibility.isMinor
                ? 'Based on your date of birth, only gearless two-wheelers are available.'
                : 'Choose the vehicle category for your licence application.'}
            </p>
            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-slate-700">Vehicle category</legend>
              <div className="mt-3 space-y-3">
                {ageEligibility.availableVehicleCategories.map((category) => (
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-md border bg-white p-4 text-sm text-slate-700 has-[:checked]:border-trust-blue-600 has-[:checked]:bg-trust-blue-50"
                    key={category.value}
                  >
                    <input
                      checked={wizard.draft.vehicleCategory === category.value}
                      className="size-4 accent-trust-blue-700"
                      name="vehicle-category"
                      onChange={() => wizard.updateField('vehicleCategory', category.value)}
                      type="radio"
                      value={category.value}
                    />
                    {category.label}
                  </label>
                ))}
              </div>
              <FieldError message={wizard.errors.vehicleCategory} />
            </fieldset>

            {ageEligibility.isMinor && (
              <label className="mt-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <input
                  checked={wizard.draft.parentConsent}
                  className="mt-0.5 size-4 accent-trust-blue-700"
                  onChange={(event) => wizard.updateField('parentConsent', event.target.checked)}
                  type="checkbox"
                />
                <span>
                  I confirm that my parent or guardian has consented to this application.
                  <FieldError message={wizard.errors.parentConsent} />
                </span>
              </label>
            )}
          </section>
        )}

        {wizard.step === 2 && (
          <section aria-labelledby="review-application-heading">
            <h2 className="text-lg font-semibold text-slate-950" id="review-application-heading">
              Review your application
            </h2>
            <dl className="mt-6 divide-y divide-slate-200 rounded-md border border-slate-200">
              <div className="grid gap-1 p-4 sm:grid-cols-3">
                <dt className="text-sm font-medium text-slate-500">Full name</dt>
                <dd className="text-sm text-slate-900 sm:col-span-2">{wizard.draft.fullName}</dd>
              </div>
              <div className="grid gap-1 p-4 sm:grid-cols-3">
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="text-sm text-slate-900 sm:col-span-2">{wizard.draft.email}</dd>
              </div>
              <div className="grid gap-1 p-4 sm:grid-cols-3">
                <dt className="text-sm font-medium text-slate-500">Date of birth</dt>
                <dd className="text-sm text-slate-900 sm:col-span-2">{formatDate(wizard.draft.dateOfBirth)}</dd>
              </div>
              <div className="grid gap-1 p-4 sm:grid-cols-3">
                <dt className="text-sm font-medium text-slate-500">Vehicle category</dt>
                <dd className="text-sm text-slate-900 sm:col-span-2">
                  {VEHICLE_CATEGORIES.find((category) => category.value === wizard.draft.vehicleCategory)
                    ?.label ?? 'Not selected'}
                </dd>
              </div>
            </dl>
          </section>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button disabled={wizard.step === 0 || wizard.submissionState === 'submitting'} onClick={wizard.goBack} variant="secondary">
            Back
          </Button>
          {wizard.step < 2 ? (
            <Button onClick={wizard.goNext}>Continue</Button>
          ) : (
            <Button disabled={wizard.submissionState === 'submitting'} onClick={wizard.submit}>
              {wizard.submissionState === 'submitting' ? 'Submitting application…' : 'Submit application'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
