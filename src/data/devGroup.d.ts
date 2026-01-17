import type { InferEntrySchema } from 'astro:content'

export type DevGroups = InferEntrySchema<'devGroups'>
export type DevGroupName = DevGroups['name']
export type DevGroupDescription = DevGroups['description']
export type DevGroupIconLight = DevGroups['iconLight']
export type DevGroupIconDark = DevGroups['iconDark']
export type DevGroupLink = DevGroups['link']
