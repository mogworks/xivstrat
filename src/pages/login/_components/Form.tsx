import { GlowingEffect } from '@/components/shadcn-react/glowing-effect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-react/tabs'
import SignIn from './SignIn'
import SignUp from './SignUp'

const Glow = () => (
  <GlowingEffect blur={0} borderWidth={1} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
)

export default function Form() {
  const urlParams = new URLSearchParams(window.location.search)
  const defaultTab = urlParams.get('tab') === 'signup' ? 'signup' : 'signin'

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 relative mb-1">
        <Glow />
        <TabsTrigger value="signin">登录</TabsTrigger>
        <TabsTrigger value="signup">注册</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="relative rounded-xl">
        <Glow />
        <SignIn />
      </TabsContent>
      <TabsContent value="signup" className="relative rounded-xl">
        <Glow />
        <SignUp />
      </TabsContent>
    </Tabs>
  )
}
