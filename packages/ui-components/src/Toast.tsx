import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms — default 4000, set 0 to persist
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ── Individual toast item ──────────────────────────────────────────────────
const STYLES: Record<ToastType, { bar: string; icon: string; bg: string; border: string }> = {
  success: { bar: 'bg-emerald-500', icon: 'text-emerald-500', bg: 'bg-white',  border: 'border-emerald-100' },
  error:   { bar: 'bg-red-500',     icon: 'text-red-500',     bg: 'bg-white',  border: 'border-red-100'     },
  warning: { bar: 'bg-amber-400',   icon: 'text-amber-500',   bg: 'bg-white',  border: 'border-amber-100'   },
  info:    { bar: 'bg-blue-500',    icon: 'text-blue-500',    bg: 'bg-white',  border: 'border-blue-100'    },
};

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const s = STYLES[toast.type];
  const Icon = ICONS[toast.type];
  const duration = toast.duration ?? 4000;

  // Progress bar
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    if (duration === 0) return;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDismiss(toast.id);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, toast.id, onDismiss]);

  return (
    <div
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-xl shadow-lg border ${s.bg} ${s.border} px-4 py-3 overflow-hidden`}
      style={{ animation: 'mlc-slide-in 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      {/* left accent bar */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${s.bar}`} />

      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.icon}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* progress bar */}
      {duration > 0 && (
        <span
          className={`absolute bottom-0 left-0 h-0.5 ${s.bar} opacity-40 transition-none`}
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

// ── Provider ───────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: 'error',   title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: 'info',    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}

      {/* Toast container — top-right, stacks downward */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
        style={{ minWidth: '20rem' }}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      {/* Keyframe injection — only injected once, safe to repeat */}
      <style>{`
        @keyframes mlc-slide-in {
          from { opacity: 0; transform: translateX(1.5rem) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)       scale(1);    }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
