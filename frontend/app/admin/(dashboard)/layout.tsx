import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col gap-6 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
