import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#2F4A34] text-[#EDEAE0] hover:bg-[#2F4A34]/90 active:bg-[#2F4A34]",
        outline:
          "border border-[#20291F] bg-transparent text-[#20291F] hover:bg-[#20291F]/10 active:bg-[#20291F]/20",
        secondary:
          "bg-[#4E5D5A]/15 text-[#20291F] hover:bg-[#4E5D5A]/25",
        ghost:
          "hover:bg-[#20291F]/10 text-[#20291F]",
        destructive:
          "bg-[#8C3B2E] text-[#EDEAE0] hover:bg-[#8C3B2E]/90",
        link: "text-[#2F4A34] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 text-sm",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-8 gap-1.5 px-3 text-xs",
        lg: "h-11 gap-2 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
