import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useDebounceFn } from 'ahooks'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { emailSchema, signInSchema } from '@/auth/schema'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'
import { PasswordInput } from './PasswordInput'
import { TurnstileCaptcha } from './TurnstileCaptcha'

export default function SignIn() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  const isPopup = new URLSearchParams(window.location.search).get('isPopup') === 'true'

  const handleAuthSuccess = () => {
    if (isPopup && window.opener) {
      window.opener.postMessage('sign-in-success', '*')
      window.close()
    }
  }

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      const validationResult = signInSchema.safeParse({
        emailOrUsername,
        password,
      })

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0]
        toast.error(firstError.message)
        return
      }

      if (!turnstileToken) {
        toast.error('请完成人机验证')
        return
      }

      const data = validationResult.data

      const searchParams = new URLSearchParams(window.location.search)
      const callbackURL = searchParams.get('callbackURL') || `${import.meta.env.PUBLIC_SITE_URL}/account`

      setLoading(true)
      try {
        if (emailSchema.safeParse(data.emailOrUsername).success) {
          toast.promise(
            authClient.signIn.email({
              email: data.emailOrUsername,
              password: data.password,
              callbackURL,
              fetchOptions: {
                headers: {
                  'x-captcha-response': turnstileToken,
                },
                onError: (_ctx) => {
                  setTurnstileToken(null)
                  turnstileRef.current?.reset()
                },
              },
            }),
            {
              loading: '登录中...',
              success: (res) => {
                if (!res || res.error || !res.data) {
                  setTurnstileToken(null)
                  turnstileRef.current?.reset()
                  throw new Error(res?.error?.message || '登录失败，请检查您的邮箱和密码')
                }
                handleAuthSuccess()
                window.location.href = callbackURL
                return '登录成功'
              },
              error: (error) => error.message || '登录失败，请检查您的邮箱和密码',
            },
          )
        } else {
          toast.promise(
            authClient.signIn.username({
              username: data.emailOrUsername,
              password: data.password,
              callbackURL,
              fetchOptions: {
                headers: {
                  'x-captcha-response': turnstileToken,
                },
                onError: (_ctx) => {
                  setTurnstileToken(null)
                  turnstileRef.current?.reset()
                },
              },
            }),
            {
              loading: '登录中...',
              success: (res) => {
                if (!res || res.error || !res.data) {
                  setTurnstileToken(null)
                  turnstileRef.current?.reset()
                  throw new Error(res?.error?.message || '登录失败，请检查您的账号和密码')
                }
                handleAuthSuccess()
                window.location.href = callbackURL
                return '登录成功'
              },
              error: (error) => error.message || '登录失败，请检查您的账号和密码',
            },
          )
        }
      } finally {
        setLoading(false)
      }
    },
    {
      wait: 500,
      leading: true,
    },
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>在下方输入您的邮箱/账号登录您的账户</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email-or-username">
              邮箱/账号
              <span className="bg-red-500 h-1 w-1 rounded-full"></span>
            </Label>
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
              <Label htmlFor="password">
                密码
                <span className="bg-red-500 h-1 w-1 rounded-full"></span>
              </Label>
              <a href="/reset-password" className="ml-auto inline-block text-sm underline hover:text-primary">
                忘记密码？
              </a>
            </div>

            <PasswordInput
              id="password"
              placeholder="请输入密码"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>

          <div className="grid gap-2">
            <TurnstileCaptcha
              ref={turnstileRef}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !turnstileToken} onClick={handleSubmit}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <p>登录</p>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
