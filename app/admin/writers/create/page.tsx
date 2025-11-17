import { redirect } from "next/navigation";
import CreateWriterForm from "@/app/components/create_form/CreateWriterForm";
import { getCurrentUser } from "@/lib/auth"; // You'll need to implement this

export default async function CreateWriterPage() {
  // Get the current logged-in user
  const currentUser = await getCurrentUser();

  // Check if user is admin
  if (!currentUser || currentUser.id !== 'admin') {
    redirect('/'); // Redirect non-admin users to home page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CreateWriterForm />
    </div>
  );
}