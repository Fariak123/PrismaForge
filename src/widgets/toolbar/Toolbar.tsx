import { Plus, Download, Settings } from "lucide-react";

interface ToolbarProps {
  onAddTable: () => void;
  onExport: () => void;
}

export default function Toolbar({ onAddTable, onExport }: ToolbarProps) {
  return (
    <header className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold text-white">
        PrismaForge
      </h1>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddTable}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={16} />
          Table
        </button>

        <button
          onClick={onExport}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
        >
          Export
        </button>

        <button className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800">
          <Download size={18} />
        </button>

        <button className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:bg-zinc-800">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}