"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { FormField } from "../ui/form";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";

// Password regex: at least 1 uppercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, t("passwordMinLength"))
        .regex(passwordRegex, t("passwordRequirements")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

type ResetPasswordData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

interface ResetPasswordFormProps {
  onSubmit: (data: { newPassword: string }) => void | Promise<void>;
  isLoading?: boolean;
}

export default function ResetPasswordForm({ onSubmit, isLoading }: ResetPasswordFormProps) {
  const t = useTranslations("ResetPassword");

  const resetPasswordSchema = createResetPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleFormSubmit = (data: ResetPasswordData) => {
    onSubmit({ newPassword: data.newPassword });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 w-full">
      <FormField label={t("newPassword")} error={errors.newPassword?.message}>
        <Input
          type="password"
          placeholder={t("newPasswordPlaceholder")}
          startIcon={<Lock className="size-4 text-gray-400" />}
          {...register("newPassword")}
        />
      </FormField>

      <FormField label={t("confirmPassword")} error={errors.confirmPassword?.message}>
        <Input
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          startIcon={<Lock className="size-4 text-gray-400" />}
          {...register("confirmPassword")}
        />
      </FormField>

      <p className="text-xs text-gray-500">{t("passwordHint")}</p>

      <Button type="submit" size="lg" disabled={isLoading}>
        {isLoading ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
