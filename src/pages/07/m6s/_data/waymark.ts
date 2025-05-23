import type { WaymarkData } from '@/pixi/waymark'

export const waymarkData: WaymarkData = {
  A: { X: 0, Z: -10 },
  B: { X: 10, Z: 0 },
  C: { X: 0, Z: 10 },
  D: { X: -10, Z: 0 },
  One: { X: -10, Z: -10 },
  Two: { X: 10, Z: -10 },
  Three: { X: 10, Z: 10 },
  Four: { X: -10, Z: 10 },
}

export const waymarkDataABCD: WaymarkData = {
  A: { X: 0, Z: -10 },
  B: { X: 10, Z: 0 },
  C: { X: 0, Z: 10 },
  D: { X: -10, Z: 0 },
}

export const waymarkData1234: WaymarkData = {
  One: { X: -10, Z: -10 },
  Two: { X: 10, Z: -10 },
  Three: { X: 10, Z: 10 },
  Four: { X: -10, Z: 10 },
}

export const waymarkDataReverse: WaymarkData = {
  C: { X: 0, Z: -10 },
  D: { X: 10, Z: 0 },
  A: { X: 0, Z: 10 },
  B: { X: -10, Z: 0 },
  Three: { X: -10, Z: -10 },
  Four: { X: 10, Z: -10 },
  One: { X: 10, Z: 10 },
  Two: { X: -10, Z: 10 },
}

export const waymarkDataR180: WaymarkData = {
  A: { X: 0, Z: -10, rotation: Math.PI },
  B: { X: 10, Z: 0, rotation: Math.PI },
  C: { X: 0, Z: 10, rotation: Math.PI },
  D: { X: -10, Z: 0, rotation: Math.PI },
  One: { X: -10, Z: -10, rotation: Math.PI },
  Two: { X: 10, Z: -10, rotation: Math.PI },
  Three: { X: 10, Z: 10, rotation: Math.PI },
  Four: { X: -10, Z: 10, rotation: Math.PI },
}
