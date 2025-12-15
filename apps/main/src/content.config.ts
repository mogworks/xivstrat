import { defineCollection, reference, z } from 'astro:content'
import { file, glob } from 'astro/loaders'

const duties = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/data/duties' }),
  schema: () =>
    z.object({
      name: z.string(),
      short: z.string().optional(),
      spoilerFree: z.boolean().optional(), // 首页卡片入口是否防剧透
      spoilerFreeName: z.string().optional(), // 首页卡片入口防剧透的情况下，显示的副本名称
      type: z.union([z.literal('raid'), z.literal('ultimate'), z.literal('trial')]),
      title: z.string(),
      description: z.string(),
      navigationInfo: z
        .object({
          name: z.string().optional(),
          parent: z.array(z.string()).optional(),
        })
        .optional(),
      banner: z.string(),
      date: z.string(),
      href: z.string(),
      status: z.union([z.literal('upcoming'), z.literal('live'), z.literal('done')]),
      indexAvailable: z.boolean(),
      docLink: z.string().optional(),
      videoLink: z.string().optional(),
      phases: z.array(
        z.object({
          href: z.string(),
          title: z.string(),
          subtitle: z.string(),
          name: z.string(),
          mechanics: z.array(
            z.object({
              href: z.string(),
              name: z.string(),
            }),
          ),
        }),
      ),
    }),
})

const dutyGroups = defineCollection({
  loader: file('src/data/dutyGroups.json'),
  schema: z.object({
    id: z.string(),
    group: z.string(),
    duties: z.array(reference('duties')),
  }),
})

const developers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/developers' }),
  schema: () =>
    z.object({
      name: z.string(),
      breakNames: z.array(z.string()).optional(),
      gameName: z.string(),
      avatar: z.string(),
      link: z.string(),
    }),
})

const devGroups = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/dev-groups' }),
  schema: () =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      iconDark: z.string(),
      iconLight: z.string(),
      link: z.string(),
    }),
})

export const collections = { duties, dutyGroups, developers, devGroups }
