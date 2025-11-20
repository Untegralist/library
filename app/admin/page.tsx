import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // --- DEBUG LOGGING ---
  console.log("--- ADMIN PAGE DEBUG ---");
  console.log("Session User:", session?.user);
  // ---------------------

  // 1. Check if User exists
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // 2. Check if Role is Admin
  if (session.user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You are logged in as <strong>{session.user.name}</strong> (Role: {session.user.role}), 
            but this page requires <strong>admin</strong> privileges.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/api/auth/signout?callbackUrl=/login"
              className="w-full py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm"
            >
              Sign Out & Retry
            </Link>
            <Link 
              href="/" 
              className="w-full py-2.5 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden selection:bg-blue-100">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Welcome back, {session.user.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/writers/create"
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">Register Writer &rarr;</h2>
            <p className="text-gray-500">Create new writer accounts and credentials.</p>
          </Link>

          <Link 
            href="/admin/writers/view"
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">View Directory &rarr;</h2>
            <p className="text-gray-500">Manage existing writers.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}