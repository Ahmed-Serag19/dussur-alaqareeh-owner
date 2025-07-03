import { z } from "zod"

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("auth.validation.emailRequired")).email(t("auth.validation.emailInvalid")),
    password: z.string().min(1, t("auth.validation.passwordRequired")).min(6, t("auth.validation.passwordMinLength")),
  })

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

export type LoginDto = z.infer<typeof loginSchema>
