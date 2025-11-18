import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Check if user is admin - this will protect ALL admin routes
  if (!currentUser || currentUser.id !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}