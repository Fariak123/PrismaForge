import { Plus, Import, FileCode, SaveCheck, SquarePlus } from 'lucide-react';
import ProjectStatus from './ProjectStatus';

interface ToolbarProps {
  onAddTable: () => void;
  onNewProject: () => void;
  onGenerateSchema: () => void;
  onSaveProject: () => void;
  isDirty: boolean;
  onOpenProject: () => void;
}

export default function Toolbar({
  onAddTable,
  onGenerateSchema,
  onNewProject,
  onSaveProject,
  isDirty,
  onOpenProject,
}: ToolbarProps) {
  return (
    <header className="absolute left-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 backdrop-blur">
      <h1 className="flex text-lg font-semibold text-white">
        PrismaForge
        {isDirty && <ProjectStatus dirty={isDirty} />}
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
          onClick={() => onGenerateSchema()}
          className="
    flex items-center gap-2
    rounded-lg
    border border-zinc-700
    bg-zinc-900
    px-4 py-2
    text-sm text-zinc-300
    transition
    hover:border-blue-500
    hover:text-white
  "
        >
          <FileCode size={16} />
          Generate Prisma Schema
        </button>

        <button
          onClick={onNewProject}
          className="
    flex
    items-center
    gap-2
    rounded-lg
    border
    border-zinc-700
    bg-zinc-900
    px-3
    py-2
    text-sm
    text-zinc-300
    hover:bg-zinc-800
  "
        >
          <SquarePlus size={16} />
          New
        </button>

        <button
          onClick={onSaveProject}
          className="
    flex
    items-center
    gap-2
    rounded-lg
    border
    border-zinc-700
    bg-zinc-900
    px-3
    py-2
    text-sm
    text-zinc-300
    hover:bg-zinc-800
  "
        >
          <SaveCheck size={16} />
          Save
        </button>

        <button
          onClick={onOpenProject}
          className="flex
    items-center
    gap-2
    rounded-lg
    border
    border-zinc-700
    bg-zinc-900
    px-3
    py-2
    text-sm
    text-zinc-300
    hover:bg-zinc-800"
        >
          <Import size={16} />
          Import
        </button>
      </div>
    </header>
  );
}
