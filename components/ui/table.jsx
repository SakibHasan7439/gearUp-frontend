"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table({
  className = "",
  ...props
}) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm border-collapse", className)}
        {...props} />
    </div>
  );
}

function TableHeader({
  className = "",
  ...props
}) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-[#4E5D5A]/20", className)}
      {...props} />
  );
}

function TableBody({
  className = "",
  ...props
}) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props} />
  );
}

function TableFooter({
  className = "",
  ...props
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-[#4E5D5A]/20 font-medium", className)}
      {...props} />
  );
}

function TableRow({
  className = "",
  ...props
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[#4E5D5A]/20 transition-colors hover:bg-[#4E5D5A]/5",
        className
      )}
      {...props} />
  );
}

function TableHead({
  className = "",
  ...props
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "py-3 px-3 text-left align-middle font-sans text-xs uppercase tracking-wider text-[#4E5D5A] font-semibold whitespace-nowrap",
        className
      )}
      {...props} />
  );
}

function TableCell({
  className = "",
  ...props
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "py-4 px-3 align-middle whitespace-nowrap text-[#20291F]",
        className
      )}
      {...props} />
  );
}

function TableCaption({
  className = "",
  ...props
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs font-mono text-[#4E5D5A]", className)}
      {...props} />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
