import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none shadow-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#0F5B4F] text-white hover:bg-[#093D35] shadow-[0_10px_30px_rgba(15,91,79,0.18)]",
        outline:
          "border-[#DCE5E1] bg-white text-[#14221F] hover:bg-[#F5F7F2] hover:text-[#0F5B4F] aria-expanded:bg-[#F5F7F2] aria-expanded:text-[#0F5B4F]",
        secondary:
          "bg-[#DFEEE8] text-[#0F5B4F] hover:bg-[#cfe3dc] aria-expanded:bg-[#DFEEE8] aria-expanded:text-[#0F5B4F]",
        ghost:
          "border-transparent bg-transparent text-[#60716D] shadow-none hover:bg-[#F5F7F2] hover:text-[#0F5B4F] aria-expanded:bg-[#F5F7F2] aria-expanded:text-[#0F5B4F]",
        destructive:
          "bg-[#FDECEC] text-[#B42318] hover:bg-[#FCE3E0] focus-visible:border-[#B42318]/40 focus-visible:ring-[#B42318]/20",
        link: "text-[#0F5B4F] underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default:
          "h-9 gap-2 px-4 py-2 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1.5 rounded-full px-3 text-xs in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-full px-3.5 text-[0.8rem] in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-9 rounded-full p-0",
        "icon-xs":
          "size-7 rounded-full p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-full p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
