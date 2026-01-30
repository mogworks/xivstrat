import { z } from 'zod'
import type { authClient } from './client'

export type User = typeof authClient.$Infer.Session.user
export type Session = typeof authClient.$Infer.Session.session

export const emailSchema = z.email('请输入有效的邮箱格式')

export const passwordSchema = z.string().min(1, '请输入密码').min(8, '密码至少8位').max(32, '密码最多32位')

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = z.object({
  name: z.string().optional(),
  email: emailSchema,
  password: passwordSchema,
})
