import type { InferEntrySchema } from 'astro:content'

export type DutyGroup = InferEntrySchema<'dutyGroups'>
export type Duty = InferEntrySchema<'duties'>
export type DutyType = Duty['type']
export type DutyStatus = Duty['status']
export type DutyPhase = Duty['phases'][number]
export type DutyMechanic = DutyPhase['mechanics'][number]
