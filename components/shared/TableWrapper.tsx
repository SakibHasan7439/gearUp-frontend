import { cn } from "@/lib/utils";

export default function TableWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden border border-[#4E5D5A]/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
