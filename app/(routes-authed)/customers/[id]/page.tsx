import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCustomerById } from "@/app/actions/customers";
import CustomerInfo from "@/components/customers/customerInfo";
import CustomerForms from "@/components/customers/customerForms";
import { CustomerInfoSkeleton } from "@/components/customers/skeletons/CustomerInfoSkeleton";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customerId = parseInt(id, 10);

  if (isNaN(customerId)) {
    notFound();
  }

  const t = await getTranslations("CustomerDetail");

  const result = await getCustomerById(customerId);
  if (!result.success) {
    notFound();
  }
  const customer = result.data;

  return (
    <main className="max-w-384 mx-auto p-4">
      {/* Customer Info Section */}
      <div className="flex flex-col bg-gray-100 rounded-2xl p-6 shadow-md mb-6">
        <Suspense fallback={<CustomerInfoSkeleton />}>
          <CustomerInfo customer={customer} />
        </Suspense>
      </div>

      {/* Forms Section */}
      <div className="flex flex-col bg-gray-100 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("addToCustomer")}</h2>
        <CustomerForms customerId={customerId} />
      </div>
    </main>
  );
}
