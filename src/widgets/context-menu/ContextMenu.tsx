import type { ReactNode } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  children: ReactNode;
}

export default function ContextMenu({
  x,
  y,
  children,
}: ContextMenuProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
      }}
      className="
        z-50
        min-w-48

        overflow-hidden

        rounded-xl

        border
        border-zinc-700

        bg-zinc-900/95

        p-1

        shadow-2xl

        backdrop-blur-md
      "
    >
      {children}
    </div>
  );
}