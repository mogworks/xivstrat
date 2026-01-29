import { useDebounceFn } from 'ahooks'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { signUpSchema } from '@/auth/schema'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'
import { PasswordInput } from './PasswordInput'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { TurnstileCaptcha } from './TurnstileCaptcha'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      const validationResult = signUpSchema.safeParse({
        name,
        email,
        username,
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

      try {
        setLoading(true)
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name || data.email.split('@')[0],
          username: data.username,
          fetchOptions: {
            headers: {
              'x-captcha-response': turnstileToken,
            },
            onError: (ctx) => {
              const errorMessage = ctx.error.message || '注册失败，请稍后重试'
              toast.error(errorMessage)
            },
            onSuccess: () => {
              toast.success('注册成功，请查收验证邮件', {
                duration: 3000,
                position: 'top-center',
                onAutoClose: () => {
                  const searchParams = new URLSearchParams(window.location.search)
                  const callbackUrl = searchParams.get('callbackUrl')
                  if (callbackUrl) {
                    window.location.href = callbackUrl
                  } else {
                    window.location.href = '/account'
                  }
                },
              })
            },
          },
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试'
        toast.error(errorMessage)
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
        <CardTitle>注册</CardTitle>
        <CardDescription>创建一个新账户</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="username">账号</Label>
            <Input
              id="username"
              type="text"
              placeholder="选填，4~32位字母、数字、下划线或点"
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              value={username}
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
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !turnstileToken} onClick={handleSubmit}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <p>注册</p>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
