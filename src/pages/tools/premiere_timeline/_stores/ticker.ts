import { atom, onMount } from 'nanostores'

export const $ticker = atom<number>(Date.now())

onMount($ticker, () => {
  $ticker.set(Date.now())
  const updating = setInterval(() => {
    $ticker.set(Date.now())
  }, 50)
  return () => {
    clearInterval(updating)
  }
})
