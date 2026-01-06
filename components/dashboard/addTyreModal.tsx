"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import Modal from "../ui/modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import SuccessMessage from "../ui/successMessage";

import { useCreateTyre } from "@/hooks";
import { tyreSchema, TyreFormData } from "@/lib/schemas/tyreSchema";
import { fetchLocations } from "@/app/actions/tyrehotel";

interface AddTyreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTyreModal({ isOpen, onClose, onSuccess }: AddTyreModalProps) {
  const t = useTranslations("AddTyreModal");
  const { create, loading, error: hookError } = useCreateTyre();

  const [locations, setLocations] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TyreFormData>({
    resolver: zodResolver(tyreSchema),
    defaultValues: {
      plate: "",
      number: "",
      location: "",
    },
  });

  // Reset state and load data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Reset state synchronously before fetching
    reset();

    // Fetch locations asynchronously
    fetchLocations().then((result) => {
      if (result.success) setLocations(result.data);
    });
  }, [isOpen, reset]);

  // Auto-close on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose, onSuccess]);

  const onSubmit = async (data: TyreFormData) => {
    setServerError(null);

    const result = await create(data);

    if (result?.success) {
      setSuccess(true);
    } else {
      setServerError(hookError ?? result?.error ?? t("genericError"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("title")}>
      {success ? (
        <SuccessMessage title={t("success")} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plate">{t("plate")}</Label>
            <Input id="plate" placeholder="ABC-123" {...register("plate")} error={!!errors.plate} />
            {errors.plate && <span className="text-xs text-red-500">{errors.plate.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="number">{t("phone")}</Label>
            <Input
              id="number"
              placeholder="+358 40 123 4567"
              {...register("number")}
              error={!!errors.number}
            />
            {errors.number && <span className="text-xs text-red-500">{errors.number.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              list="locations"
              placeholder={t("locationPlaceholder")}
              {...register("location")}
              error={!!errors.location}
            />
            <datalist id="locations">
              {locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
            {errors.location && (
              <span className="text-xs text-red-500">{errors.location.message}</span>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="rounded-xl min-w-[100px]" loading={loading}>
              {t("submit")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
