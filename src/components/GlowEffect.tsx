import { GlowingEffect } from '@/components/shadcn-react/glowing-effect'

export const GlowEffect = () => (
  <GlowingEffect blur={0} borderWidth={1} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
)
