import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetronomeAdminForm } from "@/components/forms/metronome-admin-form";

export const metadata = constructMetadata({
  title: "Admin – Gnomes AI",
  description: "Admin page for only admin management.",
});

export default async function AdminPage() {
  
  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Demo setup."
      />
      <MetronomeAdminForm />
    </>
  );
}
