import DashboardShell from "@/components/shared/DashboardShell";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
