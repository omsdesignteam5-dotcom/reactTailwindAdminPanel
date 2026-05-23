import { useCallback, useSyncExternalStore } from "react";

/* ── types ───────────────────────────────── */
export type ToastVariant =
  | "default"
  | "success"
  | "destructive"
  | "warning"
  | "info"
  | "neutral";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  action?: React.ReactNode;
  duration?: number;
}

type Listener = () => void;

/* ── store ───────────────────────────────── */
let toasts: ToastData[] = [];
const listeners = new Set<Listener>();
let count = 0;

function emitChange() {
  for (const l of listeners) l();
}

function addToast(toast: Omit<ToastData, "id">) {
  const id = String(++count);
  toasts = [...toasts, { ...toast, id }];
  emitChange();

  const ms = toast.duration ?? 5000;
  if (ms > 0) {
    setTimeout(() => dismissToast(id), ms);
  }
  return id;
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

/* ── hook ────────────────────────────────── */
export function useToast() {
  const currentToasts = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
  );

  const toast = useCallback(
    (data: Omit<ToastData, "id">) => addToast(data),
    [],
  );

  return { toasts: currentToasts, toast, dismiss: dismissToast };
}

/* ── imperative api ──────────────────────── */
export const toast = (data: Omit<ToastData, "id">) => addToast(data);
