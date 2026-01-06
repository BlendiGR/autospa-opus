"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, FileText } from "lucide-react";
import AddJobForm from "./addJobForm";
import AddInvoiceForm from "./addInvoiceForm";

interface CustomerFormsProps {
  customerId: number;
}

type TabType = "job" | "invoice";

export default function CustomerForms({ customerId }: CustomerFormsProps) {
  const t = useTranslations("CustomerDetail");
  const [activeTab, setActiveTab] = useState<TabType>("job");

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("job")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === "job"
              ? "bg-[#111827] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          {t("addJob")}
        </button>
        <button
          onClick={() => setActiveTab("invoice")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === "invoice"
              ? "bg-[#111827] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FileText className="w-4 h-4" />
          {t("addInvoice")}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "job" && <AddJobForm customerId={customerId} />}
      {activeTab === "invoice" && <AddInvoiceForm customerId={customerId} />}
    </div>
  );
}
