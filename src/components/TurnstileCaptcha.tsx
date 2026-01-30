import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import type { Ref } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface TurnstileCaptchaProps {
  ref?: Ref<TurnstileInstance | null>
  onSuccess: (token: string) => void
  onExpire: () => void
  onError: () => void
  nonInteractive?: boolean
}

export function TurnstileCaptcha({ ref, onSuccess, onExpire, onError, nonInteractive = false }: TurnstileCaptchaProps) {
  const theme = useTheme()

  return (
    <Turnstile
      ref={ref}
      options={{
        theme,
        size: 'flexible',
        execution: nonInteractive ? 'execute' : 'render',
      }}
      siteKey={
        import.meta.env.DEV
          ? '1x00000000000000000000AA'
          : import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
      }
      onSuccess={onSuccess}
      onExpire={onExpire}
      onError={onError}
    />
  )
}
