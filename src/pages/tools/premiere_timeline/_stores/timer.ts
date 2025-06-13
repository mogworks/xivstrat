import { atom } from 'nanostores'

export const $timer = atom(0)

export let stopTimer: (() => void) | undefined

export const startTimer = () => {
  const start = Date.now()
  $timer.set(0)
  const updating = setInterval(() => {
    $timer.set(Date.now() - start)
  }, 50)
  stopTimer = () => {
    clearInterval(updating)
  }
  return stopTimer
}
