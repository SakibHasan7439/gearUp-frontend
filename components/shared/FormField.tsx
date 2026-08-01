"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const formLabelClass =
  "font-sans text-xs uppercase tracking-wider text-[#4E5D5A]";

export const formInputClass =
  "rounded-none border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus-visible:ring-0 focus-visible:border-[#B8823A]";

export const formTextareaClass =
  "w-full rounded-none border border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus:outline-none focus:border-[#B8823A]";

export const formSelectClass =
  "w-full rounded-none border border-[#4E5D5A]/40 bg-transparent px-3 py-2 text-sm text-[#20291F] focus:outline-none focus:border-[#B8823A]";

export const formErrorClass = "text-xs font-mono text-[#8C3B2E]";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className={formLabelClass}>
        {label}
      </Label>
      {children}
      {error && <p className={formErrorClass}>{error}</p>}
    </div>
  );
}
