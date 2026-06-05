import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";

//Utils
import { cn } from "src/utils/utils";

/* ── context ───────────────────────────────── */
interface OTPContextValue {
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
}
const OTPContext = createContext<OTPContextValue>({
  value: "",
  maxLength: 6,
  onChange: () => {},
});

/* ── InputOTP (root) ───────────────────────── */
interface InputOTPProps {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  (
    { maxLength = 6, value: controlledValue, onChange, children, className },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState("");
    const value = controlledValue ?? uncontrolled;
    const handleChange = useCallback(
      (v: string) => {
        const clean = v.replace(/\D/g, "").slice(0, maxLength);
        onChange ? onChange(clean) : setUncontrolled(clean);
      },
      [maxLength, onChange],
    );

    return (
      <OTPContext.Provider value={{ value, maxLength, onChange: handleChange }}>
        <div ref={ref} className={cn("flex items-center gap-2", className)}>
          {children}
        </div>
      </OTPContext.Provider>
    );
  },
);
InputOTP.displayName = "InputOTP";

/* ── InputOTPGroup ─────────────────────────── */
const InputOTPGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

/* ── InputOTPSlot ──────────────────────────── */
interface InputOTPSlotProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  index: number;
}

const InputOTPSlot = forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ index, className, ...props }, _ref) => {
    const { value, maxLength, onChange } = useContext(OTPContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const char = value[index] ?? "";
    const isFilled = char !== "";

    const focusSlot = (i: number) => {
      const parent =
        inputRef.current?.closest("[data-otp-root]") ??
        inputRef.current?.parentElement?.parentElement;
      if (!parent) return;
      const slots = parent.querySelectorAll<HTMLInputElement>(
        "input[data-otp-slot]",
      );
      slots[i]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (char) {
          onChange(value.slice(0, index) + value.slice(index + 1));
        } else if (index > 0) {
          onChange(value.slice(0, index - 1) + value.slice(index));
          focusSlot(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusSlot(index - 1);
      } else if (e.key === "ArrowRight" && index < maxLength - 1) {
        focusSlot(index + 1);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget.value.replace(/\D/g, "");
      if (!input) return;
      const next = value.slice(0, index) + input[0] + value.slice(index + 1);
      onChange(next);
      if (index < maxLength - 1) focusSlot(index + 1);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;
      const next = value.slice(0, index) + pasted;
      onChange(next.slice(0, maxLength));
      focusSlot(Math.min(index + pasted.length, maxLength - 1));
    };

    useEffect(() => {
      if (inputRef.current) inputRef.current.value = char;
    }, [char]);

    return (
      <input
        ref={inputRef}
        data-otp-slot
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={char}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        className={cn(
          "h-10 w-10 rounded-md border border-input bg-transparent text-center text-sm font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isFilled && "border-foreground/30",
          className,
        )}
        {...props}
      />
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

/* ── InputOTPSeparator ─────────────────────── */
function InputOTPSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-muted-foreground px-1", className)}
      aria-hidden="true"
      {...props}>
      –
    </span>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
