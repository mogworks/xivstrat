import { Turnstile } from '@marsidev/react-turnstile'
import { useTheme } from '@/hooks/useTheme'

interface TurnstileCaptchaProps {
  onSuccess: (token: string) => void
  onExpire: () => void
  onError: () => void
}

export function TurnstileCaptcha({ onSuccess, onExpire, onError }: TurnstileCaptchaProps) {
  const theme = useTheme()

  return (
    <Turnstile
      options={{
        theme,
        size: 'flexible',
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
