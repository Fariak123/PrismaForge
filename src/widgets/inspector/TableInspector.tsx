import { Database, Plus } from 'lucide-react';
import { useSelectedTable } from '../../features/canvas/editor.selectors';
import ColumnEditor from '../../entities/column/ColumnEditor';
import { useSchemaStore } from '../../entities/schema/schema.store';

export default function Inspector() {
  const table = useSelectedTable();
  const renameTable = useSchemaStore((state) => state.renameTable);
  const addColumn = useSchemaStore((state) => state.addColumn);

  const deleteTable = useSchemaStore((state) => state.deleteTable);

  if (!table) return null;

  return (
    <>
      <div className="border-b border-zinc-800 p-5 flex-shrink-0">
        <div className="mb-2 flex items-center gap-2">
          <Database className="text-blue-400" size={18} />
          <input
            value={table.name}
            onChange={(e) => renameTable(table.id, e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <p className="text-xs text-zinc-500">Table Properties</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
          Columns
        </label>

        <div className="space-y-2">
          {table.columns.map((column) => (
            <ColumnEditor key={column.id} nodeId={table.id} column={column} />
          ))}
        </div>

        <button
          onClick={() => addColumn(table.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-zinc-400 transition hover:border-blue-500 hover:text-blue-400"
        >
          <Plus size={16} />
          Add Column
        </button>
      </div>

      <div className="border-t border-zinc-800 p-5">
        <button
          onClick={() => deleteTable(table.id)}
          className="
      w-full
      rounded-lg
      bg-red-600
      py-2
      text-sm
      font-medium
      text-white
      transition
      hover:bg-red-500
      active:scale-95
    "
        >
          Delete Table
        </button>
      </div>
    </>
  );
}
