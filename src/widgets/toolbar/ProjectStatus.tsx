import { CircleDot } from 'lucide-react';

export default function ProjectStatus({ dirty }: { dirty: boolean }) {
  return (
    <div
      className={`ml-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 transition-all duration-200
        ${dirty ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      style={{
        boxShadow:
          'inset 0 1px rgba(255,255,255,.04), inset 0 -1px rgba(0,0,0,.8)',
      }}
    >
      <CircleDot size={12} className="text-amber-500" />

      <span
        className="text-xs font-medium tracking-wide text-zinc-500"
        style={{
          textShadow: '0 1px 0 rgba(0,0,0,.9)',
        }}
      >
        Modified
      </span>
    </div>
  );
}
