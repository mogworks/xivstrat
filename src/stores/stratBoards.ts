import { map } from 'nanostores'
import type { Application } from 'pixi.js'

export const $stratBoards = map<{ [key: string]: Application }>({})
