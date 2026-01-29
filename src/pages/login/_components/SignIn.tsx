import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { authClient } from '@/auth/reactClient'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'

const isEmail = (str: string) => {
  // TODO
  return false
}

export default function SignIn() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">登录</CardTitle>
        <CardDescription className="text-xs md:text-sm">在下方输入您的邮箱/账号登录您的账户</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email-or-username">邮箱/账号</Label>
            <Input
              id="email-or-username"
              type="text"
              placeholder="请输入邮箱或账号"
              required
              onChange={(e) => {
                setEmailOrUsername(e.target.value)
              }}
              value={emailOrUsername}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">密码</Label>
              <a href="/" className="ml-auto inline-block text-sm underline">
                忘记密码？
              </a>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="请输入密码"
              required
              autoComplete="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              if (isEmail(emailOrUsername)) {
                await authClient.signIn.email({
                  email: emailOrUsername,
                  password,
                  fetchOptions: {
                    onRequest: () => {
                      setLoading(true)
                    },
                    onResponse: () => {
                      setLoading(false)
                    },
                  },
                })
              } else {
                await authClient.signIn.username({
                  username: emailOrUsername,
                  password,
                  fetchOptions: {
                    onRequest: () => {
                      setLoading(true)
                    },
                    onResponse: () => {
                      setLoading(false)
                    },
                  },
                })
              }
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <p>登录</p>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
