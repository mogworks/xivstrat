import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { GlowEffect } from '@/components/GlowEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-react/tabs'
import RequestPasswordReset from './RequestPasswordReset'
import SignIn from './SignIn'
import SignUp from './SignUp'

export default function Form() {
  const urlParams = new URLSearchParams(window.location.search)
  const defaultTab =
    urlParams.get('tab') === 'signup' ? 'signup' : urlParams.get('tab') === 'reset' ? 'reset' : 'signin'
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const errorHandledRef = useRef(false)

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error')
    if (error && !errorHandledRef.current) {
      toast.error(error)
      errorHandledRef.current = true
    }
  }, [])

  const [resetEmail, setResetEmail] = useState<string | undefined>(undefined)

  return (
    <div className="w-full p-16 max-w-lg mx-auto">
      <Tabs
        value={currentTab}
        onValueChange={(v) => setCurrentTab(v as 'signin' | 'signup' | 'reset')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 relative mb-1">
          <GlowEffect />
          <TabsTrigger value="signin">登录</TabsTrigger>
          <TabsTrigger value="signup">注册</TabsTrigger>
          <TabsTrigger value="reset">重置密码</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="relative rounded-xl">
          <GlowEffect />
          <SignIn
            onSwitchToReset={(email) => {
              setResetEmail(email)
              setCurrentTab('reset')
            }}
          />
        </TabsContent>
        <TabsContent value="signup" className="relative rounded-xl">
          <GlowEffect />
          <SignUp />
        </TabsContent>
        <TabsContent value="reset" className="relative rounded-xl">
          <GlowEffect />
          <RequestPasswordReset initialEmail={resetEmail} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
