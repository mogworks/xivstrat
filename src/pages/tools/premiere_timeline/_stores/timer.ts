import { atom } from 'nanostores'

export const $timer = atom(0)

let stopTimer: (() => void) | undefined

export const startTimer = (offset = 0) => {
  const start = Date.now()
  $timer.set(offset)
  const updating = setInterval(() => {
    $timer.set(Date.now() - start + offset)
  }, 50)
  stopTimer = () => {
    clearInterval(updating)
  }
  return stopTimer
}

export const getStopTimer = () => stopTimer
