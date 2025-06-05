import type { InferEntrySchema } from 'astro:content'

export type Developer = InferEntrySchema<'developers'>
export type DeveloperName = Developer['name']
export type DeveloperGameName = Developer['gameName']
export type DeveloperImageUrl = Developer['imgUrl']
export type DeveloperLink = Developer['link']
