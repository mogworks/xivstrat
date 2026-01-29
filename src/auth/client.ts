import { createAuthClient } from 'better-auth/client'
import { usernameClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_SERVER_URL,
  plugins: [usernameClient()],
})
