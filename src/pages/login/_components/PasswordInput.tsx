import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../../../components/shadcn-react/input-group'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  id?: string
  required?: boolean
  autoComplete?: string
  className?: string
}

export function PasswordInput({
  value,
  onChange,
  placeholder = '请输入密码',
  id,
  required = false,
  autoComplete = '',
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <InputGroup className={className}>
      <InputGroupInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="[-webkit-text-security:auto] [text-security:disc] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          variant="ghost"
          size="icon-xs"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? '隐藏密码' : '显示密码'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default PasswordInput
