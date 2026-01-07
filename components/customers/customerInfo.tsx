import { getTranslations } from "next-intl/server";
import { User, Mail, Phone, Building2 } from "lucide-react";

interface CustomerInfoProps {
  customer: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
  };
}

export default async function CustomerInfo({ customer }: CustomerInfoProps) {
  const t = await getTranslations("CustomerDetail");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-sm text-gray-500">{t("customerProfile")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("email")}</p>
            <p className="font-medium text-gray-900">{customer.email || "—"}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("phone")}</p>
            <p className="font-medium text-gray-900">{customer.phone || "—"}</p>
          </div>
        </div>

        {/* Company */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{t("company")}</p>
            <p className="font-medium text-gray-900">{customer.company || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
