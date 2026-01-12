// lib/form.ts

export type FormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export const initialFormState: FormState = {
  success: false,
  errors: {},
  message: '',
};