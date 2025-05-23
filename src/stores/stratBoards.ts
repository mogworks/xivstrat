import type { Application } from 'pixi.js'

import { map } from 'nanostores'

export const $stratBoards = map<{ [key: string]: Application }>({})
