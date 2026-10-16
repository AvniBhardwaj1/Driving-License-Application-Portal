import assert from 'node:assert/strict'

import { getAgeEligibility } from '../src/features/applications/eligibility.ts'

assert.equal(getAgeEligibility('2008-10-17', new Date(2026, 9, 16)).isMinor, true)
assert.equal(getAgeEligibility('2008-10-16', new Date(2026, 9, 16)).isMinor, false)
assert.deepEqual(
  getAgeEligibility('2010-01-01', new Date(2026, 9, 16)).availableVehicleCategories.map(
    (category) => category.value,
  ),
  ['gearless_two_wheeler'],
)

console.log('Age eligibility checks passed.')
