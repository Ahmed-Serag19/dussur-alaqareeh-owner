import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodSchema } from "zod"

const useFormValidation = <T extends {}>(schema: ZodSchema<T>) => {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })
}

export default useFormValidation
