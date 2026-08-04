import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  primary?: boolean;
  onClick: () => void;
}

export default function ActionCard({
  icon,
  title,
  description,
  primary = false,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden

        rounded-2xl
        border

        p-6
        text-left

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-2xl

        ${
          primary
            ? `
              border-blue-500/40
              bg-blue-500/10
              hover:border-blue-400
            `
            : `
              border-zinc-800
              bg-zinc-900/70
              hover:border-zinc-700
            `
        }
      `}
    >
      <div
        className="
          mb-5
          inline-flex
          h-12
          w-12
          items-center
          justify-center

          rounded-xl

          bg-zinc-800

          text-blue-400
        "
      >
        {icon}
      </div>

      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-400">
        {description}
      </p>

      <ArrowRight
        size={18}
        className="
          absolute

          bottom-5
          right-5

          translate-x-3

          opacity-0

          transition-all
          duration-300

          group-hover:translate-x-0
          group-hover:opacity-100
        "
      />
    </button>
  );
}