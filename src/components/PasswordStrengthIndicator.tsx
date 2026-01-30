import { cn } from '@/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = () => {
    let score = 0
    if (password && password.length >= 8) score++
    if (password && /[A-Z]/.test(password)) score++
    if (password && /[0-9]/.test(password)) score++
    if (password && /[^A-Za-z0-9]/.test(password)) score++
    return score as 0 | 1 | 2 | 3 | 4
  }

  const getMessage = (strength: 0 | 1 | 2 | 3 | 4) => {
    switch (strength) {
      case 0:
        return '密码强度：弱'
      case 1:
        return '密码强度：弱'
      case 2:
        return '密码强度：中'
      case 3:
        return '密码强度：中'
      case 4:
        return '密码强度：强'
    }
  }

  const getStrengthColor = (strength: 0 | 1 | 2 | 3 | 4) => {
    switch (strength) {
      case 0:
        return 'bg-gray-200'
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-amber-500'
      case 3:
        return 'bg-yellow-500'
      case 4:
        return 'bg-green-500'
    }
  }

  const strength = calculateStrength()
  const message = getMessage(strength)

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300 ease-out', getStrengthColor(strength))}
            style={{ width: `${strength * 25}%` }}
          />
        </div>
        <span className="text-sm text-foreground/80">{message}</span>
      </div>
    </div>
  )
}
