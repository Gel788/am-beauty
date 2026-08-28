import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-[0.625rem] font-normal tracking-[0.24em] uppercase whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-black bg-black text-white hover:bg-transparent hover:text-black",
        outline:
          "border-black bg-transparent text-black hover:bg-black hover:text-white",
        secondary:
          "border-border bg-cream text-charcoal hover:border-black hover:bg-black hover:text-white",
        ghost: "border-transparent text-grey hover:text-black",
        destructive: "border-destructive bg-destructive/10 text-destructive",
        link: "border-transparent p-0 normal-case tracking-normal underline underline-offset-4",
      },
      size: {
        default: "h-11 gap-2 px-8",
        xs: "h-8 gap-1 px-4 text-[10px]",
        sm: "h-9 gap-1.5 px-6",
        lg: "h-12 gap-2 px-10",
        icon: "size-11",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
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
