import { defineMiddleware } from 'astro:middleware'
import { authClient } from '@/auth/client'

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null
  context.locals.session = null

  try {
    const { data } = await authClient.getSession()

    if (data) {
      context.locals.user = data.user
      context.locals.session = data.session
    }
  } catch {}

  return next()
})
