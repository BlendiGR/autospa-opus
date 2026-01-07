import { User, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface UserInfoCardProps {
  name: string;
  email: string;
}

export default async function UserInfoCard({ name, email }: UserInfoCardProps) {
  const t = await getTranslations("Settings");

  return (
    <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 sm:p-6 md:p-8 gap-4 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("userInfo")}</h2>
          <p className="text-sm text-gray-500">{t("userInfoSubtitle")}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="bg-white rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">{t("name")}</p>
            <p className="text-sm font-medium text-gray-900">{name || "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">{t("email")}</p>
            <p className="text-sm font-medium text-gray-900">{email || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
