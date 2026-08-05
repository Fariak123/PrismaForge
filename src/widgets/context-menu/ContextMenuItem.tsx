import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

export default function ContextMenuItem({
  icon,
  label,
  danger,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3

        rounded-lg

        px-3
        py-2

        text-sm

        transition

        ${
          danger
            ? `
            text-red-400
            hover:bg-red-500/10
          `
            : `
            text-zinc-300
            hover:bg-zinc-800
            hover:text-white
          `
        }
      `}
    >
      {icon}

      {label}
    </button>
  );
}
