import type { InferEntrySchema } from 'astro:content'

export type Developer = InferEntrySchema<'developers'>
export type DeveloperName = Developer['name']
export type DeveloperGameName = Developer['gameName']
export type DeveloperAvatar = Developer['avatar']
export type DeveloperLink = Developer['link']
