import type { VehicleCategory } from './eligibility'

export type ApplicationDraft = {
  fullName: string
  email: string
  dateOfBirth: string
  vehicleCategory: VehicleCategory | ''
  parentConsent: boolean
}

export type ApplicationPayload = Omit<ApplicationDraft, 'vehicleCategory'> & {
  vehicleCategory: VehicleCategory
}

export type ApplicationResponse = {
  id: string
  full_name: string
  email: string
  date_of_birth: string
  vehicle_category: VehicleCategory
  parent_consent: boolean
  status: 'pending' | 'approved' | 'rejected'
}
