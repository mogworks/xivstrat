import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'

export default function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                required
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                required
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
                value={lastName}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await authClient.signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                callbackURL: '/account',
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false)
                  },
                  onRequest: () => {
                    setLoading(true)
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message)
                  },
                  onSuccess: () => {
                    // TODO
                  },
                },
              })
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create your account'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
