import axios from 'axios'

import type { ApplicationPayload, ApplicationResponse } from '../features/applications/types'
import { apiClient } from './api-client'

type ErrorResponse = { detail?: unknown }

export async function createApplication(payload: ApplicationPayload): Promise<ApplicationResponse> {
  const { data } = await apiClient.post<ApplicationResponse>('/applications', {
    full_name: payload.fullName,
    email: payload.email,
    date_of_birth: payload.dateOfBirth,
    vehicle_category: payload.vehicleCategory,
    parent_consent: payload.parentConsent,
  })
  return data
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error) && typeof error.response?.data?.detail === 'string') {
    return error.response.data.detail
  }

  return 'We could not submit your application. Please try again.'
}
