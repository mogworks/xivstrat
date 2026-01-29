import { defineMiddleware } from 'astro:middleware'
import { authClient } from '@/auth/client'

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    return next()
  }

  context.locals.user = null
  context.locals.session = null

  try {
    const cookie = context.request.headers.get('cookie')

    const { data } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: cookie || '',
        },
      },
    })

    if (data) {
      context.locals.user = data.user
      context.locals.session = data.session
    }
  } catch {}

  return next()
})
