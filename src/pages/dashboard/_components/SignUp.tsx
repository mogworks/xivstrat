import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useDebounceFn } from 'ahooks'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { signUpSchema } from '@/auth/schema'
import { PasswordInput } from '@/components/PasswordInput'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'
import { TurnstileCaptcha } from '@/components/TurnstileCaptcha'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  const isPopup = new URLSearchParams(window.location.search).get('isPopup') === 'true'

  const handleAuthSuccess = useCallback(() => {
    if (isPopup && window.opener) {
      window.opener.postMessage('sign-up-success', '*')
      window.close()
    }
  }, [isPopup])

  useEffect(() => {
    if (registered && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (registered && countdown === 0) {
      handleAuthSuccess()
    }
  }, [registered, countdown, handleAuthSuccess])

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      const validationResult = signUpSchema.safeParse({
        name,
        email,
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
      const callbackURL = searchParams.get('callbackURL') || `${import.meta.env.PUBLIC_SITE_URL}/dashboard`

      setLoading(true)
      try {
        toast.promise(
          authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.name?.trim() || data.email.split('@')[0],
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
            loading: '注册中...',
            success: (res) => {
              if (!res || res.error || !res.data) {
                setTurnstileToken(null)
                turnstileRef.current?.reset()
                throw new Error(res?.error?.message || '注册失败，请稍后重试')
              }
              setRegistered(true)
              setTurnstileToken(null)
              return '注册信息已提交，请查收验证邮件，完成邮箱验证后即可登录'
            },
            error: (error) => error.message || '注册失败，请稍后重试',
          },
        )
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
      {!registered && (
        <CardHeader>
          <CardTitle>注册</CardTitle>
          <CardDescription>创建一个新账户</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {registered ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>注册信息已提交</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">注册信息已提交</h3>
            <p className="text-muted-foreground mb-4">注册信息已提交，请查收验证邮件，完成邮箱验证后即可登录</p>
            <p className="text-sm text-muted-foreground mb-4">
              验证邮件已发送至：<span className="font-medium">{email}</span>
            </p>
            {isPopup && (
              <p className="text-sm text-muted-foreground">
                窗口将在 <span className="font-medium">{countdown}</span> 秒后自动关闭
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                type="text"
                placeholder="选填，默认为邮箱前缀"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                value={name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                邮箱
                <span className="bg-red-500 h-1 w-1 rounded-full"></span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱地址"
                required
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                密码
                <span className="bg-red-500 h-1 w-1 rounded-full"></span>
              </Label>
              <PasswordInput
                id="password"
                placeholder="请输入8~32位密码"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <PasswordStrengthIndicator password={password} />
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <p>注册</p>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
