import { Database, Plus } from "lucide-react";
import { useSelectedNode } from "../../features/canvas/editor.selectors";
import { useEditorStore } from "../../features/canvas/editor.store";

export default function Inspector() {
  const node = useSelectedNode();
  const renameTable = useEditorStore(
    (state) => state.renameTable
  );
  if (!node) {
    return (
      <aside className="absolute right-0 top-14 z-40 h-[calc(100vh-56px)] w-80 border-l border-zinc-800 bg-zinc-950">
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Select a table
        </div>
      </aside>
    );
  }
  const table = node.data;

  return (
    <aside className="absolute right-0 top-14 z-40 h-[calc(100vh-56px)] w-80 border-l border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Database className="text-blue-400" size={18} />
          <input
            value={table.name}
            onChange={(e) =>
              renameTable(node.id, e.target.value)
            }
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <p className="text-xs text-zinc-500">
          Table Properties
        </p>
      </div>

      <div className="p-5">
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
          Columns
        </label>

        <div className="space-y-2">
          {table.columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2"
            >
              <span className="text-sm text-zinc-200">
                {column.name}
              </span>

              <span className="text-xs text-zinc-500">
                {column.type}
              </span>
            </div>
          ))}
        </div>

        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-zinc-400 transition hover:border-blue-500 hover:text-blue-400"
        >
          <Plus size={16} />
          Add Column
        </button>
      </div>
    </aside>
  );
}