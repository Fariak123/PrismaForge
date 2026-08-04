import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export default function FloatingActionButton({
  icon,
  label,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        group
        flex
        h-10
        w-10
        items-center
        overflow-hidden

        rounded-xl

        border
        border-zinc-800

        bg-zinc-900/95

        shadow-xl
        backdrop-blur-md

        transition-all
        duration-300

        hover:w-40
        hover:border-blue-500
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center

          text-zinc-400

          transition-colors

          group-hover:text-blue-400
        "
      >
        {icon}
      </div>

      <span
        className="
          whitespace-nowrap

          text-sm
          font-medium

          text-zinc-200

          opacity-0

          transition-all
          duration-200

          group-hover:opacity-100
        "
      >
        {label}
      </span>
    </button>
  );
}