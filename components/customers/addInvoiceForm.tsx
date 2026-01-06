"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Check, Car, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addInvoiceToCustomer } from "@/app/actions/customers";
import { customerInvoiceSchema, CustomerInvoiceFormData } from "@/lib/schemas/customerInvoiceSchema";
import { useLoading } from "@/hooks";

interface AddInvoiceFormProps {
  customerId: number;
}

export default function AddInvoiceForm({ customerId }: AddInvoiceFormProps) {
  const t = useTranslations("CustomerDetail");
  const { loading, success, setSuccess, serverError, setServerError, withLoading, resetState } =
    useLoading();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CustomerInvoiceFormData>({
    resolver: zodResolver(customerInvoiceSchema),
    defaultValues: {
      plate: "",
      items: [{ id: crypto.randomUUID(), service: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const addItem = () => {
    append({ id: crypto.randomUUID(), service: "", price: "" });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetState();
        reset({ plate: "", items: [{ id: crypto.randomUUID(), service: "", price: "" }] });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, reset, resetState]);

  const onSubmit = async (data: CustomerInvoiceFormData) => {
    await withLoading(async () => {
      const result = await addInvoiceToCustomer(customerId, data);

      if (result.success) {
        setSuccess(true);
      } else {
        setServerError(result.error ?? t("genericError"));
      }
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4 bg-white rounded-xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg font-medium text-gray-900">{t("invoiceSuccess")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white rounded-xl p-6">
      {/* Plate */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="invoice-plate">{t("invoicePlate")}</Label>
        <Input
          id="invoice-plate"
          placeholder="ABC-123"
          startIcon={<Car className="w-4 h-4" />}
          {...register("plate", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
          error={!!errors.plate}
        />
        {errors.plate && <span className="text-xs text-red-500">{errors.plate.message}</span>}
      </div>

      {/* Invoice Items */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-900">{t("invoiceItems")}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            className="text-primary hover:text-primaryhover hover:bg-primary/5"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("addItem")}
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <Input
                  placeholder={t("servicePlaceholder")}
                  {...register(`items.${index}.service`)}
                  error={!!errors.items?.[index]?.service}
                />
                {errors.items?.[index]?.service && (
                  <span className="text-xs text-red-500">{errors.items[index].service.message}</span>
                )}
              </div>
              <div className="w-32">
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.price`)}
                  error={!!errors.items?.[index]?.price}
                />
                {errors.items?.[index]?.price && (
                  <span className="text-xs text-red-500">{errors.items[index].price.message}</span>
                )}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {t("removeItem")}
                </Button>
              )}
            </div>
          ))}
        </div>

        {errors.items?.message && (
          <span className="text-xs text-red-500">{errors.items.message}</span>
        )}
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" className="rounded-xl min-w-28" loading={loading}>
          {t("addInvoiceButton")}
        </Button>
      </div>
    </form>
  );
}
