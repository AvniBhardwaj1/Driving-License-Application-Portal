import { useMemo } from 'react'

import { getAgeEligibility } from '../eligibility'

export function useAgeEligibility(dateOfBirth: string) {
  return useMemo(() => getAgeEligibility(dateOfBirth), [dateOfBirth])
}
