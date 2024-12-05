"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { login } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-[300px] flex-col gap-2"
    >
      <div className="flex flex-col gap-2">
        <Input id="email" {...register("email")} placeholder="Email" />
      </div>
      {errors?.email && <p className="text-red-500">{errors.email.message}</p>}

      <div className="flex flex-col gap-2">
        <Input
          id="password"
          {...register("password")}
          type="password"
          placeholder="Password"
        />
      </div>
      {errors?.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      <Button disabled={isSubmitting} type="submit">
        Login
      </Button>
    </form>
  );
}
