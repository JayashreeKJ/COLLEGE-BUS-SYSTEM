import { useToastState } from '../../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastState();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => {
        const icon =
          t.type === 'success'
            ? '✅'
            : t.type === 'error'
            ? '❌'
            : t.type === 'warning'
            ? '⚠️'
            : 'ℹ️';

        return (
          <div
            key={t.id}
            className={`toast-item toast-${t.type}`}
            onClick={() => removeToast(t.id)}
            role="alert"
          >
            <span className="toast-icon">{icon}</span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(t.id);
              }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
