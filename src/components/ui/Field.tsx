import type { ComponentProps, ReactNode } from "react";

const inputClass =
  "w-full rounded-sm border border-stone bg-white px-4 py-3 text-base text-ink placeholder:text-slate/70 focus:border-navy";

export function Label({ children, htmlFor, required }: { children: ReactNode; htmlFor: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy">
      {children}
      {required && <span className="text-red-700" aria-hidden="true"> *</span>}
    </label>
  );
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`${inputClass} min-h-28 ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return <select className={`${inputClass} ${className}`} {...props} />;
}

export function Field({ id, label, required, hint, children }: { id: string; label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      {children}
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-slate">{hint}</p>}
    </div>
  );
}

export function FormMessage({ result }: { result: { ok: boolean; error?: string; message?: string } | null }) {
  if (!result) return null;
  if (!result.ok) {
    return (
      <p role="alert" className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        {result.error}
      </p>
    );
  }
  if (result.message) {
    return (
      <p role="status" className="rounded-sm border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
        {result.message}
      </p>
    );
  }
  return null;
}
