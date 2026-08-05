import { Trash2 } from 'lucide-react';
import {
  type TableColumn,
  type DataType,
  COLUMN_TYPES,
} from '../table/table.types';
import { useSchemaStore } from '../schema/schema.store';
import { useEditorStore } from '../../features/canvas/editor.store';
import { useEffect } from 'react';

interface Props {
  nodeId: string;
  column: TableColumn;
}

export default function ColumnEditor({ nodeId, column }: Props) {
  const updateColumn = useSchemaStore((state) => state.updateColumn);

  const deleteColumn = useSchemaStore((state) => state.deleteColumn);

  const highlighted = useEditorStore(
    (s) => s.highlightedColumnId === column.id,
  );

  useEffect(() => {
    if (!highlighted) return;

    document.getElementById(`column-${column.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [highlighted, column.id]);

  return (
    <div
      id={`column-${column.id}`}
      className={`rounded-lg border ${highlighted ? 'animate-ping-highlight' : ''} bg-zinc-900 p-3 transition-all duration-350`}
    >
      <input
        value={column.name}
        onChange={(e) =>
          updateColumn(nodeId, column.id, {
            name: e.target.value,
          })
        }
        className="mb-3 w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white"
      />

      <select
        value={column.type}
        onChange={(e) =>
          updateColumn(nodeId, column.id, {
            type: e.target.value as DataType,
          })
        }
        className="mb-3 w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white"
      >
        {COLUMN_TYPES.map((type: DataType) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.primaryKey}
          onChange={(e) =>
            updateColumn(nodeId, column.id, {
              primaryKey: e.target.checked,
            })
          }
        />
        Primary Key
      </label>

      <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.unique}
          onChange={(e) =>
            updateColumn(nodeId, column.id, {
              unique: e.target.checked,
            })
          }
        />
        Unique
      </label>

      <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.nullable}
          onChange={(e) =>
            updateColumn(nodeId, column.id, {
              nullable: e.target.checked,
            })
          }
        />
        Nullable
      </label>

      <button
        onClick={() => deleteColumn(nodeId, column.id)}
        className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}
