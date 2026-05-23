//Components
import { useToast } from "./useToast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

export function Toaster() {
  const { toasts } = useToast();

  // Group toasts by position
  const groupedToasts = toasts.reduce(
    (acc, t) => {
      const pos = t.position || "top-right";
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(t);
      return acc;
    },
    {} as Record<string, typeof toasts>,
  );

  return (
    <>
      {Object.entries(groupedToasts).map(([pos, posToasts]) => (
        <ToastProvider key={pos}>
          {posToasts.map(({ id, title, description, variant, action }) => (
            <Toast key={id} variant={variant} position={pos as any}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          ))}
          <ToastViewport position={pos as any} />
        </ToastProvider>
      ))}
    </>
  );
}
