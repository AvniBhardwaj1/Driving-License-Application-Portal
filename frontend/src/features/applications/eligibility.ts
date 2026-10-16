export const VEHICLE_CATEGORIES = [
  { value: 'gearless_two_wheeler', label: 'Gearless Two-Wheeler' },
  { value: 'motorcycle_with_gear', label: 'Motorcycle with Gear' },
  { value: 'light_motor_vehicle', label: 'Light Motor Vehicle' },
] as const

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number]['value']

export type AgeEligibility = {
  age: number | null
  isMinor: boolean
  isFutureDate: boolean
  availableVehicleCategories: Array<(typeof VEHICLE_CATEGORIES)[number]>
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const parsedDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return parsedDate.getFullYear() === Number(match[1]) &&
    parsedDate.getMonth() === Number(match[2]) - 1 &&
    parsedDate.getDate() === Number(match[3])
    ? parsedDate
    : null
}

export function getAgeEligibility(dateOfBirth: string, today = new Date()): AgeEligibility {
  const parsedDateOfBirth = parseDateOnly(dateOfBirth)
  if (!parsedDateOfBirth) {
    return {
      age: null,
      isMinor: false,
      isFutureDate: false,
      availableVehicleCategories: [...VEHICLE_CATEGORIES],
    }
  }

  const comparisonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isFutureDate = parsedDateOfBirth > comparisonDate
  const age = isFutureDate
    ? null
    : comparisonDate.getFullYear() -
      parsedDateOfBirth.getFullYear() -
      Number(
        comparisonDate.getMonth() < parsedDateOfBirth.getMonth() ||
          (comparisonDate.getMonth() === parsedDateOfBirth.getMonth() &&
            comparisonDate.getDate() < parsedDateOfBirth.getDate()),
      )
  const isMinor = age !== null && age < 18

  return {
    age,
    isMinor,
    isFutureDate,
    availableVehicleCategories: isMinor ? [VEHICLE_CATEGORIES[0]] : [...VEHICLE_CATEGORIES],
  }
}
