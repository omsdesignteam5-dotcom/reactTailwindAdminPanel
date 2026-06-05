import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

//Utils
import { cn } from "src/utils/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    const hasIcon = !!leftIcon || !!rightIcon;

    const inputElement = (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          leftIcon ? "pl-9" : "pl-3",
          rightIcon ? "pr-9" : "pr-3",
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    if (!hasIcon) {
      return inputElement;
    }

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        {inputElement}
        {rightIcon && (
          <div className="absolute right-3 flex items-center justify-center text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
