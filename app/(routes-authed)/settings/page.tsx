import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import UserInfoCard from "@/components/settings/userInfoCard";
import BugReportForm from "@/components/settings/bugReportForm";

export default async function SettingsPage() {
  const t = await getTranslations("Settings");
  const session = await auth();

  return (
    <main className="max-w-384 mx-auto">
      {/* User Info Section */}
      <UserInfoCard
        name={session?.user?.name ?? ""}
        email={session?.user?.email ?? ""}
      />

      {/* Bug Report Section */}
      <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 sm:p-6 md:p-8 gap-4 shadow-md">
        <BugReportForm />
      </div>
    </main>
  );
}