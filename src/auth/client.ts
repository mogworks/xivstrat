import { createAuthClient } from 'better-auth/client'
import { localization } from 'better-auth-localization'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_SERVER_URL,
  plugins: [
    localization({
      defaultLocale: 'zh-Hans',
      fallbackLocale: 'default',
    }),
  ],
})
