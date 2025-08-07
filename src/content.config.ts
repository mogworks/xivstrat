import { defineCollection, reference, z } from 'astro:content'
import { file, glob } from 'astro/loaders'

const duties = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/data/duties' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      short: z.string(),
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
      banner: image(),
      date: z.string(),
      href: z.string(),
      status: z.union([z.literal('upcoming'), z.literal('live'), z.literal('done')]),
      indexAvailable: z.boolean(),
      bilibili: z.string().optional(),
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
            })
          ),
        })
      ),
      locales: z.record(
        z.object({
          cn: z.string().optional(),
          jp: z.string().optional(),
        })
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
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      breakNames: z.array(z.string()).optional(),
      gameName: z.string(),
      avatar: image(),
      link: z.string(),
    }),
})

const devGroups = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/dev-groups' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      iconDark: image(),
      iconLight: image(),
      link: z.string(),
    }),
})

export const collections = { duties, dutyGroups, developers, devGroups }
