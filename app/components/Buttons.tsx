'use client';

import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

// --- Types ---
// We restrict entityType to your actual routes to prevent typos
type EntityType = 'books' | 'writers'; 

interface BaseButtonProps {
  id?: string;
  className?: string;
}

interface CreateButtonProps {
  entityType: EntityType; 
  label?: string; // Optional override for "Create new X"
}

interface EditButtonProps extends BaseButtonProps {
  id: string;
  entityType: EntityType;
}

interface DeleteButtonProps extends BaseButtonProps {
  id: string;
  onDelete: (id: string) => Promise<void>;
}

interface SubmitButtonProps {
  label: string;
  loadingText?: string; // Explicit text for loading state
}

// --- Components ---

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-gray-600 hover:text-black font-medium text-sm mb-4 inline-flex items-center gap-2"
    >
      <FaArrowLeft /> Back
    </button>
  );
};

export const EditButton: React.FC<EditButtonProps> = ({ id, entityType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Ensure your folder structure matches this: app/books/edit/[id]/page.tsx
    await router.push(`/${entityType}/edit/${id}`);
    // We intentionally don't set loading false here, as the page will unload
  };

  return (
    <Link
      href={`/${entityType}/edit/${id}`}
      onClick={handleClick}
      className={`bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-1 px-3 rounded inline-flex items-center text-sm transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin mr-2" />
      ) : (
        <FaEdit className="mr-2" />
      )}
      <span>Edit</span>
    </Link>
  );
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this? This action cannot be undone.')) {
      startTransition(async () => {
        try {
          await onDelete(id);
        } catch (error) {
          console.error('Error deleting item:', error);
          alert("Failed to delete item.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-semibold py-1 px-3 rounded inline-flex items-center text-sm transition-colors ml-2 ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isPending ? (
        <FaSpinner className="animate-spin mr-2" />
      ) : (
        <FaTrash className="mr-2" />
      )}
      <span className="hidden md:inline">{isPending ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
};

export const CreateButton: React.FC<CreateButtonProps> = ({ entityType, label }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await router.push(`/${entityType}/create`); 
  };

  // Capitalize first letter for display (e.g. "books" -> "Books")
  const displayEntity = entityType.charAt(0).toUpperCase() + entityType.slice(1, -1); 
  // Result: "Book" or "Writer" (removes the 's')

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm inline-flex items-center text-sm mb-4 transition-colors"
    >
      {isLoading ? (
        <FaSpinner className="animate-spin mr-2" /> 
      ) : (
        <FaPlus className="mr-2" /> 
      )}
      <span>{label || (isLoading ? "Loading..." : `Create New ${displayEntity}`)}</span>
    </button>
  );
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, loadingText }) => {
  const { pending } = useFormStatus();
  
  // Default loading text logic
  const activeLoadingText = loadingText || "Saving...";

  return (
    <button 
      type="submit" 
      className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center justify-center gap-2 transition-all ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={pending}
    >
      {pending && <FaSpinner className="animate-spin" />}
      {!pending && <FaSave />}
      <span>{pending ? activeLoadingText : label}</span>
    </button>
  );
};