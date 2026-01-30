import { useDebounceFn } from 'ahooks'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { passwordSchema } from '@/auth/schema'
import { PasswordInput } from '@/components/PasswordInput'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn-react/card'
import { Label } from '@/components/shadcn-react/label'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const urlError = new URLSearchParams(window.location.search).get('error')
    if (urlError) {
      toast.error(urlError)
    }
  }, [])

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (success && countdown === 0) {
      window.location.href = '/dashboard'
    }
  }, [success, countdown])

  const { run: handleSubmit } = useDebounceFn(
    async () => {
      const validationResult = passwordSchema.safeParse(password)

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0]
        toast.error(firstError.message)
        return
      }

      const searchParams = new URLSearchParams(window.location.search)
      const token = searchParams.get('token')
      if (!token) {
        toast.error('无效的重置链接')
        return
      }

      const data = validationResult.data

      setLoading(true)
      const toastId = toast.loading('重置中...')
      try {
        const res = await authClient.resetPassword({
          newPassword: data,
          token,
        })

        if (res.error) {
          toast.error(res.error.message || '密码重置失败，请稍后重试', { id: toastId })
        } else {
          setSuccess(true)
          toast.success('密码重置成功', { id: toastId })
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '密码重置失败，请稍后重试', { id: toastId })
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
      {success ? (
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>密码重置成功</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">密码重置成功</h3>
            <p className="text-muted-foreground">正在跳转到登录页面... ({countdown})</p>
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle>重置密码</CardTitle>
            <CardDescription>输入您的新密码</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">
                  新密码
                  <span className="bg-red-500 h-1 w-1 rounded-full"></span>
                </Label>
                <PasswordInput
                  id="password"
                  placeholder="请输入8~32位新密码"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
                <PasswordStrengthIndicator password={password} />
              </div>

              <Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <p>确认重置</p>}
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}
