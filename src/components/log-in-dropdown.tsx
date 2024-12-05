"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { z } from "zod";
import { login } from "~/app/(auth)/login/actions";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormSchema = z.infer<typeof loginSchema>;

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
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
    reset();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="hidden rounded bg-primary-dark px-4 py-2 text-white hover:bg-primary-dark_hover sm:block">
          {t("login")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-3"
        align="end"
        side="bottom"
        sideOffset={5}
        alignOffset={5}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input id="email" {...register("email")} className="w-full" />
            {errors?.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className="w-full"
            />
          </div>
          {errors?.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {t("login")}
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
