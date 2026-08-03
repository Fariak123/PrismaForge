import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DialogModalProps {
  open: boolean;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  confirmVariant?: 'primary' | 'danger';

  onConfirm: () => void;

  onCancel: () => void;
}

export default function DialogModal({
  open,

  title,

  description,

  confirmText = 'OK',

  cancelText = 'Cancel',

  confirmVariant = 'primary',

  onConfirm,

  onCancel,
}: DialogModalProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }

      if (e.key === 'Enter') {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={onCancel}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-[420px] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>

          <button
            onClick={onCancel}
            className="rounded p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-800 p-5">
          <button
            onClick={onCancel}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:bg-zinc-800"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-white transition ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
