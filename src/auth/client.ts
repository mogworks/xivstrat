import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_SERVER_URL,
})
