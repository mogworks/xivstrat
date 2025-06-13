import { computed, map } from 'nanostores'

export const $mitigations = map({
  MT: [1, 1, 1],
  ST: [1, 1, 1],
  D1: [1, 1, 1],
  D2: [1, 1, 1],
  D3: [1, 1, 1],
  D4: [1, 1, 1],
})

export const $mitigation = computed($mitigations, (mitigations) => {
  const res = {
    physical: 1,
    magical: 1,
    special: 1,
  }
  const keys = ['physical', 'magical', 'special']
  for (let i = 0; i < 3; i++) {
    let m = Object.values(mitigations).reduce((acc, mitigation) => {
      return acc * mitigation[i]
    }, 1)
    if (mitigations.MT[0] !== 1 && mitigations.ST[0] !== 1) {
      m /= 0.9
    }
    res[keys[i] as keyof typeof res] = m
  }
  if (mitigations.D1[0] !== 1 && mitigations.D2[0] !== 1 && mitigations.D4[0] !== 1) {
    // 牵制和昏乱同时在的话，D2无论是近战还是法系，减伤都等于无效了
    res.physical /= 0.95
    res.magical /= 0.95
  }
  return res
})
