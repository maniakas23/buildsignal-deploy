import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-400",
        ghost: "bg-transparent text-slate-200 hover:bg-slate-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = ({ className, variant, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant }), className)} {...props} />
);
