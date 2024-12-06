"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type LoginFormSchema, loginSchema } from "~/lib/types/schemas";
import { login, registerUser } from "~/server/auth/actions";
import { toast } from "sonner";
import { LogIn, Pencil, PenSquareIcon, Plus } from "lucide-react";

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="hidden rounded bg-primary-dark px-4 py-2 text-white hover:bg-primary-dark_hover sm:block">
          {t("login")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-3"
        align="end"
        side="bottom"
        sideOffset={5}
        alignOffset={5}
      >
        <LoginForm onSubmit={() => setIsOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type LoginFormProps = {
  onSubmit: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
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

  const onLogin: SubmitHandler<LoginFormSchema> = async (data) => {
    const result = await login(data.email, data.password);
    if (result?.error) {
      toast.error(result.error);
    } else {
      reset();
      onSubmit();
    }
  };

  const onRegister: SubmitHandler<LoginFormSchema> = async (data) => {
    const result = await registerUser(data.email, data.password);
    if (result?.error) {
      toast.error(result.error);
    } else {
      reset();
      onSubmit();
    }
  };

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          {t("slideInMenu.email")}
        </label>
        <Input id="email" {...register("email")} className="w-full" />
        {errors?.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          {t("slideInMenu.password")}
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
      <div className="flex items-center justify-between gap-1">
        <Button
          onClick={handleSubmit(onLogin)}
          disabled={isSubmitting}
          className="w-full"
        >
          <LogIn className="h-2 w-2" /> {t("slideInMenu.logIn")}
        </Button>
        <Button
          onClick={handleSubmit(onRegister)}
          disabled={isSubmitting}
          className="w-full"
        >
          <PenSquareIcon className="h-2 w-2" /> {t("signup")}
        </Button>
      </div>
    </form>
  );
};
