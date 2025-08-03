import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, TypeOf } from "zod";

const useFormValidation = <Schema extends ZodType<any, any, any>>(
  schema: Schema
) => {
  return useForm<TypeOf<Schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
};

export default useFormValidation;
