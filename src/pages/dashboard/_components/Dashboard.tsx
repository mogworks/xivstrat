import { authClient } from '@/auth/reactClient'
import Account from './Account'
import Form from './Form'

export default function Dashboard() {
  const { data: authData } = authClient.useSession()
  const { user, session } = authData || {}

  return user && session ? <Account user={user} /> : <Form />
}
