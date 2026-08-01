import DashboardShell from "@/components/shared/DashboardShell";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
