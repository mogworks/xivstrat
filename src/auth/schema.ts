import { z } from 'zod'

export const emailSchema = z.email('请输入有效的邮箱格式')

export const usernameSchema = z
  .string()
  .min(4, '账号至少4位')
  .max(32, '账号最多32位')
  .regex(/^[a-zA-Z0-9_.]{4,32}$/, '账号只能包含字母、数字、下划线或点')

export const passwordSchema = z.string().min(1, '请输入密码').min(8, '密码至少8位').max(32, '密码最多32位')

export const signInSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, '请输入邮箱或账号')
    .refine((val) => {
      // 尝试用邮箱验证
      const emailResult = emailSchema.safeParse(val)
      if (emailResult.success) return true

      // 尝试用用户名验证
      const usernameResult = usernameSchema.safeParse(val)
      if (usernameResult.success) return true

      return false
    }, '请输入有效的邮箱或4-32位账号，账号只能包含字母、数字、下划线或点'),
  password: passwordSchema,
})

export const signUpSchema = z
  .object({
    name: z.string().optional(),
    email: emailSchema,
    username: usernameSchema.optional(),
    password: passwordSchema,
  })
  .superRefine((data, _ctx) => {
    if (!data.name && data.email) {
      const emailPrefix = data.email.split('@')[0]
      if (emailPrefix) {
        data.name = emailPrefix
      }
    }
  })
