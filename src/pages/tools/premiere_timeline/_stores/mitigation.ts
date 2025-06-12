import { computed, map } from 'nanostores'

export const $mitigations = map({
  MT: [1, 1, 1],
  ST: [1, 1, 1],
  D1: [1, 1, 1],
  D2: [1, 1, 1],
  D3: [1, 1, 1],
  D4: [1, 1, 1],
})

export const $physical = computed($mitigations, (mitigations) => {
  const res = Object.values(mitigations).reduce((acc, mitigation) => {
    return acc * mitigation[0]
  }, 1)
  if (mitigations.MT[0] !== 1 && mitigations.ST[0] !== 1) {
    return res / 0.9
  }
  return res
})

export const $magical = computed($mitigations, (mitigations) => {
  const res = Object.values(mitigations).reduce((acc, mitigation) => {
    return acc * mitigation[1]
  }, 1)
  if (mitigations.MT[0] !== 1 && mitigations.ST[0] !== 1) {
    return res / 0.9
  }
  return res
})

export const $special = computed($mitigations, (mitigations) => {
  const res = Object.values(mitigations).reduce((acc, mitigation) => {
    return acc * mitigation[2]
  }, 1)
  if (mitigations.MT[0] !== 1 && mitigations.ST[0] !== 1) {
    return res / 0.9
  }
  return res
})
