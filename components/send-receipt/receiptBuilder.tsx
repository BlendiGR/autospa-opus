"use client";

import { useTranslations } from "next-intl";

import { useLoading, useInvoiceForm } from "@/hooks";
import { sendReceipt } from "@/app/actions/sendReceipt";
import SuccessMessage from "./successMessage";
import ReceiptForm from "./receiptForm";
import ReceiptPreviewSection from "./receiptPreviewSection";

/**
 * ReceiptBuilder - Manages the receipt form and preview.
 *
 * Handles form submission with loading/success/error states using useLoading hook.
 */
export default function ReceiptBuilder() {
  const t = useTranslations("SendReceipt");
  const {
    loading,
    success,
    setSuccess,
    serverError,
    setServerError,
    withLoading,
    resetState,
  } = useLoading();

  const { form, register, fields, watchedValues, addItem, removeItem, resetForm, canRemoveItem } =
    useInvoiceForm();

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    await withLoading(async () => {
      const result = await sendReceipt(data);

      if (!result.success) {
        setServerError(result.error || t("genericError"));
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        resetState();
        resetForm();
      }, 3000);
    });
  });

  if (success) {
    return <SuccessMessage title={t("success")} description={t("successDescription")} />;
  }

  return (
    <div className="w-full max-w-384 mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 m-4">
        <ReceiptForm
          register={register}
          errors={errors}
          fields={fields}
          addItem={addItem}
          removeItem={removeItem}
          canRemoveItem={canRemoveItem}
          loading={loading}
          onSubmit={onSubmit}
          serverError={serverError}
        />
        <ReceiptPreviewSection watchedValues={watchedValues} />
      </div>
    </div>
  );
}
