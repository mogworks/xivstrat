import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { localization } from 'better-auth-localization'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_SERVER_URL,
  plugins: [
    usernameClient(),
    localization({
      defaultLocale: 'zh-Hans',
      fallbackLocale: 'default',
    }),
  ],
})
