import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useDebounceFn } from 'ahooks'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { emailSchema } from '@/auth/schema'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'
import { TurnstileCaptcha } from '@/components/TurnstileCaptcha'

interface RequestPasswordResetProps {
  initialEmail?: string
}

export default function RequestPasswordReset({ initialEmail }: RequestPasswordResetProps) {
  const [email, setEmail] = useState(initialEmail || '')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      const validationResult = emailSchema.safeParse(email)

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

      setLoading(true)
      try {
        toast.promise(
          authClient.requestPasswordReset({
            email: data,
            redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/reset-password`,
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
            loading: '发送中...',
            success: (res) => {
              if (!res || res.error || !res.data) {
                setTurnstileToken(null)
                turnstileRef.current?.reset()
                throw new Error(res?.error?.message || '发送失败，请稍后重试')
              }
              setSent(true)
              setTurnstileToken(null)
              return '重置密码邮件已发送，请查收邮箱'
            },
            error: (error) => error.message || '发送失败，请稍后重试',
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
      {!sent && (
        <CardHeader>
          <CardTitle>重置密码</CardTitle>
          <CardDescription>输入您的邮箱，我们将发送重置密码链接</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {sent ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>邮件已发送</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">邮件已发送</h3>
            <p className="text-muted-foreground mb-4">重置密码邮件已发送至您的邮箱，请查收并点击链接完成密码重置</p>
            <p className="text-sm text-muted-foreground">
              邮件已发送至：<span className="font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
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
              <TurnstileCaptcha
                ref={turnstileRef}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !turnstileToken} onClick={handleSubmit}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <p>重置密码</p>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
