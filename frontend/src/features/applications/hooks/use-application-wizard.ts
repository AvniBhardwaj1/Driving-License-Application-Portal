import { useState } from 'react'

import { useLocalStorage } from '../../../hooks/use-local-storage'
import { createApplication, getApiErrorMessage } from '../../../services/applications'
import { getAgeEligibility, VEHICLE_CATEGORIES } from '../eligibility'
import type { ApplicationDraft, ApplicationPayload, ApplicationResponse } from '../types'

const DRAFT_STORAGE_KEY = 'rto-application-draft'

const emptyDraft: ApplicationDraft = {
  fullName: '',
  email: '',
  dateOfBirth: '',
  vehicleCategory: '',
  parentConsent: false,
}

function isApplicationDraft(value: unknown): value is ApplicationDraft {
  if (!value || typeof value !== 'object') return false

  const draft = value as Record<string, unknown>
  return (
    typeof draft.fullName === 'string' &&
    typeof draft.email === 'string' &&
    typeof draft.dateOfBirth === 'string' &&
    typeof draft.parentConsent === 'boolean' &&
    (draft.vehicleCategory === '' ||
      VEHICLE_CATEGORIES.some((category) => category.value === draft.vehicleCategory))
  )
}

export type ApplicationField = keyof ApplicationDraft
export type ValidationErrors = Partial<Record<ApplicationField, string>>
type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

function validateStep(step: number, draft: ApplicationDraft): ValidationErrors {
  const eligibility = getAgeEligibility(draft.dateOfBirth)
  const errors: ValidationErrors = {}

  if (step === 0 || step === 2) {
    if (draft.fullName.trim().length < 2) errors.fullName = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) errors.email = 'Enter a valid email address.'
    if (!draft.dateOfBirth) {
      errors.dateOfBirth = 'Enter your date of birth.'
    } else if (eligibility.isFutureDate) {
      errors.dateOfBirth = 'Date of birth cannot be in the future.'
    }
  }

  if (step === 1 || step === 2) {
    if (!draft.vehicleCategory) {
      errors.vehicleCategory = 'Select a vehicle category.'
    } else if (eligibility.isMinor && draft.vehicleCategory !== 'gearless_two_wheeler') {
      errors.vehicleCategory = 'Applicants under 18 may select only a gearless two-wheeler.'
    }
    if (eligibility.isMinor && !draft.parentConsent) {
      errors.parentConsent = 'Parent or guardian consent is required for applicants under 18.'
    }
  }

  return errors
}

function toApplicationPayload(draft: ApplicationDraft): ApplicationPayload | null {
  if (!draft.vehicleCategory) return null

  return {
    ...draft,
    fullName: draft.fullName.trim(),
    email: draft.email.trim(),
    vehicleCategory: draft.vehicleCategory,
  }
}

export function useApplicationWizard() {
  const [draft, setDraft, clearDraft] = useLocalStorage(
    DRAFT_STORAGE_KEY,
    emptyDraft,
    isApplicationDraft,
  )
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const [submissionError, setSubmissionError] = useState('')
  const [submittedApplication, setSubmittedApplication] = useState<ApplicationResponse | null>(null)
  const eligibility = getAgeEligibility(draft.dateOfBirth)

  function updateField<Field extends ApplicationField>(field: Field, value: ApplicationDraft[Field]) {
    setDraft((currentDraft) => {
      const nextDraft: ApplicationDraft = { ...currentDraft, [field]: value }
      const nextEligibility = getAgeEligibility(nextDraft.dateOfBirth)

      if (nextEligibility.isMinor && nextDraft.vehicleCategory !== 'gearless_two_wheeler') {
        nextDraft.vehicleCategory = 'gearless_two_wheeler'
      }

      return nextDraft
    })
    setErrors({})
    setSubmissionError('')
  }

  function goBack() {
    setStep((currentStep) => Math.max(0, currentStep - 1))
  }

  function goNext() {
    const nextErrors = validateStep(step, draft)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setStep((currentStep) => Math.min(2, currentStep + 1))
  }

  async function submit() {
    const nextErrors = validateStep(2, draft)
    const payload = toApplicationPayload(draft)
    if (Object.keys(nextErrors).length > 0 || !payload) {
      setErrors(nextErrors)
      return
    }

    setSubmissionState('submitting')
    setSubmissionError('')

    try {
      const application = await createApplication(payload)
      clearDraft()
      setSubmittedApplication(application)
      setSubmissionState('success')
    } catch (error) {
      setSubmissionError(getApiErrorMessage(error))
      setSubmissionState('error')
    }
  }

  function startAnotherApplication() {
    setStep(0)
    setErrors({})
    setSubmissionError('')
    setSubmittedApplication(null)
    setSubmissionState('idle')
  }

  return {
    draft,
    eligibility,
    errors,
    step,
    submissionError,
    submissionState,
    submittedApplication,
    goBack,
    goNext,
    startAnotherApplication,
    submit,
    updateField,
  }
}
