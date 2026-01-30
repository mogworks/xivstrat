import { GlowEffect } from '@/components/GlowEffect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-react/tabs'
import SignIn from './SignIn'
import SignUp from './SignUp'

export default function Form() {
  const urlParams = new URLSearchParams(window.location.search)
  const defaultTab = urlParams.get('tab') === 'signup' ? 'signup' : 'signin'

  return (
    <div className="w-full p-16 max-w-lg mx-auto">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 relative mb-1">
          <GlowEffect />
          <TabsTrigger value="signin">登录</TabsTrigger>
          <TabsTrigger value="signup">注册</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="relative rounded-xl">
          <GlowEffect />
          <SignIn />
        </TabsContent>
        <TabsContent value="signup" className="relative rounded-xl">
          <GlowEffect />
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  )
}
