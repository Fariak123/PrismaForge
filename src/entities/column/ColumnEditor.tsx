import { Trash2 } from "lucide-react";
import type { TableColumn, DataType } from "../table/table.types";
import { useSchemaStore } from "../schema/schema.store";


interface Props {
  nodeId: string;
  column: TableColumn;
}


export default function ColumnEditor({
  nodeId,
  column,
}: Props) {

  const updateColumn = useSchemaStore(
    (state) => state.updateColumn
  );

  const deleteColumn = useSchemaStore(
    (state) => state.deleteColumn
  );


  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">

      <input
        value={column.name}
        onChange={(e) =>
          updateColumn(
            nodeId,
            column.id,
            {
              name: e.target.value,
            }
          )
        }
        className="mb-3 w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white"
      />


      <select
        value={column.type}
        onChange={(e) =>
          updateColumn(
            nodeId,
            column.id,
            {
              type: e.target.value as DataType,
            }
          )
        }
        className="mb-3 w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white"
      >
        <option value="String">
          String
        </option>

        <option value="Int">
          Int
        </option>

        <option value="Boolean">
          Boolean
        </option>

        <option value="DateTime">
          DateTime
        </option>

        <option value="Json">
          Json
        </option>

      </select>


      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.primaryKey}
          onChange={(e) =>
            updateColumn(
              nodeId,
              column.id,
              {
                primaryKey:
                  e.target.checked,
              }
            )
          }
        />

        Primary Key
      </label>

      <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.unique}
          onChange={(e) =>
            updateColumn(
              nodeId,
              column.id,
              {
                unique:
                  e.target.checked,
              }
            )
          }
        />

        Unique
      </label>


      <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={column.nullable}
          onChange={(e) =>
            updateColumn(
              nodeId,
              column.id,
              {
                nullable:
                  e.target.checked,
              }
            )
          }
        />

        Nullable
      </label>


      <button
        onClick={() =>
          deleteColumn(
            nodeId,
            column.id
          )
        }
        className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
      >
        <Trash2 size={14}/>
        Delete
      </button>

    </div>
  );
}