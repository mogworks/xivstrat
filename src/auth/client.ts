import { createAuthClient } from 'better-auth/client'
import { localization } from 'better-auth-localization'

const getBaseURL = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SERVER_URL) {
    return import.meta.env.PUBLIC_SERVER_URL
  }
  // ssr 情况下 middleware 会在 server 端运行，所以这里不能用 import.meta
  return process.env.PUBLIC_SERVER_URL!
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    localization({
      defaultLocale: 'zh-Hans',
      fallbackLocale: 'default',
    }),
  ],
})
