import { getSystemSettings } from "@/services/settings";
import AdminSettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return <AdminSettingsForm initialSettings={JSON.parse(JSON.stringify(settings))} />;
}
