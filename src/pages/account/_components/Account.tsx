import { useDebounceFn } from 'ahooks'
import { CheckCircle, Loader2, Lock, Mail, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/auth/reactClient'
import { emailSchema, passwordSchema } from '@/auth/schema'
import { GlowEffect } from '@/components/GlowEffect'
import { Button } from '@/components/shadcn-react/button'
import { Card, CardContent } from '@/components/shadcn-react/card'
import { Input } from '@/components/shadcn-react/input'
import { Label } from '@/components/shadcn-react/label'
import { PasswordInput } from '@/pages/login/_components/PasswordInput'
import { PasswordStrengthIndicator } from '@/pages/login/_components/PasswordStrengthIndicator'

interface AccountProps {
  initialUserInfo: { name: string; email: string }
}

export default function Account({ initialUserInfo }: AccountProps) {
  const { data: authData } = authClient.useSession()
  const user = authData?.user

  const [name, setName] = useState(initialUserInfo.name)
  const [emailInput, setEmailInput] = useState(initialUserInfo.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)
  const callbackURL = searchParams.get('callbackURL') || `${import.meta.env.PUBLIC_SITE_URL}/account`

  const handleUpdateUser = async () => {
    setLoading(true)
    try {
      toast.promise(
        authClient.updateUser({
          name: name.trim() || user?.email?.split('@')[0] || '',
        }),
        {
          loading: '更新中...',
          success: (res) => {
            if (res?.error || !res?.data) {
              throw new Error(res?.error?.message || '更新失败，请稍后重试')
            }
            return '基本信息更新成功'
          },
          error: (error) => error.message || '更新失败，请稍后重试',
        },
      )
    } finally {
      setLoading(false)
    }
  }

  const { run: handleSubmitUser } = useDebounceFn(handleUpdateUser, {
    wait: 500,
    leading: true,
  })

  const handleChangeEmail = async () => {
    const result = emailSchema.safeParse(emailInput.trim())
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    if (emailInput.trim() === user?.email) {
      toast.error('新邮箱地址不能与当前邮箱相同')
      return
    }

    setLoading(true)
    try {
      toast.promise(
        authClient.changeEmail({
          newEmail: emailInput.trim(),
          callbackURL,
          fetchOptions: {
            disableSignal: true,
          },
        }),
        {
          loading: '发送中...',
          success: (res) => {
            if (res?.error || !res?.data) {
              throw new Error(res?.error?.message || '发送验证邮件失败，请稍后重试')
            }
            return '验证邮件已发送，请查收新邮箱'
          },
          error: (error) => error.message || '发送验证邮件失败，请稍后重试',
        },
      )
    } finally {
      setLoading(false)
    }
  }

  const { run: handleSubmitEmail } = useDebounceFn(handleChangeEmail, {
    wait: 500,
    leading: true,
  })

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('请输入当前密码')
      return
    }

    const result = passwordSchema.safeParse(newPassword)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      toast.promise(
        authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        }),
        {
          loading: '修改中...',
          success: (res) => {
            if (res?.error || !res?.data) {
              throw new Error(res?.error?.message || '密码修改失败，请检查当前密码是否正确')
            }
            setCurrentPassword(newPassword)
            setNewPassword('')
            return '密码修改成功'
          },
          error: (error) => error.message || '密码修改失败，请检查当前密码是否正确',
        },
      )
    } finally {
      setLoading(false)
    }
  }

  const { run: handleSubmitPassword } = useDebounceFn(handleChangePassword, {
    wait: 500,
    leading: true,
  })

  const handleSignOut = async () => {
    setLoading(true)
    try {
      toast.promise(authClient.signOut(), {
        loading: '退出中...',
        success: (res) => {
          if (res?.error || !res?.data) {
            throw new Error(res?.error?.message || '退出登录失败，请稍后重试')
          }
          window.location.href = '/login'
          return '已退出登录'
        },
        error: (error) => error.message || '退出登录失败，请稍后重试',
      })
    } finally {
      setLoading(false)
    }
  }

  const { run: handleSubmitSignOut } = useDebounceFn(handleSignOut, {
    wait: 500,
    leading: true,
  })

  return (
    <div className="w-full relative rounded-xl">
      <GlowEffect />
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">账户管理</h1>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserIcon size={20} />
                  基本信息
                </h2>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="name">昵称</Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <Button className="w-full" disabled={loading} onClick={handleSubmitUser}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>保存基本信息</span>}
                  </Button>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail size={20} />
                  邮箱管理
                </h2>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                      />
                      {user?.emailVerified && emailInput.trim() === user?.email ? (
                        <CheckCircle size={20} className="text-green-500 self-center shrink-0" />
                      ) : (
                        <span className="text-yellow-600 self-center text-sm shrink-0 whitespace-nowrap">未验证</span>
                      )}
                    </div>
                  </div>

                  <Button className="w-full" disabled={loading} onClick={handleSubmitEmail}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>更改邮箱</span>}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    点击更改后，验证邮件将发送到您的新邮箱地址，请查收并点击链接完成邮箱变更。
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock size={20} />
                  密码管理
                </h2>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <PasswordInput
                      id="currentPassword"
                      placeholder="请输入当前密码"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <PasswordInput
                      id="newPassword"
                      placeholder="请输入8~32位新密码"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordStrengthIndicator password={newPassword} />
                  </div>

                  <Button className="w-full" disabled={loading} onClick={handleSubmitPassword}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>修改密码</span>}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    修改密码后，您将在所有设备上被登出，需要使用新密码重新登录。
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserIcon size={20} />
                  账户操作
                </h2>
                <div className="grid gap-3">
                  <Button className="w-full" variant="destructive" disabled={loading} onClick={handleSubmitSignOut}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>退出登录</span>}
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
