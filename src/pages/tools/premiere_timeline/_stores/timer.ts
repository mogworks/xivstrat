import { computed } from 'nanostores'

import { $ticker } from './ticker'

const start = Date.now()

export const $timer = computed($ticker, (ticker) => {
  return ticker - start
})
