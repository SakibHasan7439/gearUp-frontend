import { RentalStatus } from "@/types";

const styles: Record<RentalStatus, string> = {
  PENDING: "bg-[#B8823A]/15 text-[#B8823A]",
  CONFIRMED: "bg-[#2F4A34]/15 text-[#2F4A34]",
  PICKED_UP: "bg-[#4E5D5A]/15 text-[#4E5D5A]",
  RETURNED: "bg-[#3B6E44]/15 text-[#3B6E44]",
  CANCELLED: "bg-[#8C3B2E]/15 text-[#8C3B2E]",
};

export default function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span
      style={{
        clipPath: "polygon(8px 0%, 100% 0%, 100% 100%, 8px 100%, 0% 50%)",
      }}
      className={`inline-flex items-center pl-3 pr-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}
