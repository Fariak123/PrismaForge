import { useSelectedRelationship } from '../../features/canvas/editor.selectors';
import { useSchemaStore } from '../../entities/schema/schema.store';
import type { Relationship } from '../../entities/schema/schema.types';

export default function RelationshipInspector() {
  const relationship = useSelectedRelationship();

  const updateRelationship = useSchemaStore(
    (state) => state.updateRelationship,
  );

  const tables = useSchemaStore((state) => state.tables);

  if (!relationship) {
    return null;
  }

  const sourceTable = tables.find(
    (table) => table.id === relationship.sourceTableId,
  );

  const targetTable = tables.find(
    (table) => table.id === relationship.targetTableId,
  );

  const sourceColumn = sourceTable?.columns.find(
    (column) => column.id === relationship.sourceColumnId,
  );

  const targetColumn = targetTable?.columns.find(
    (column) => column.id === relationship.targetColumnId,
  );

  const deleteRelationship = useSchemaStore(
    (state) => state.deleteRelationship,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 p-5">
        <h2 className="text-lg font-semibold text-white">Relationship</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 p-5">
        {[
          ['one-to-one', '1:1'],
          ['one-to-many', '1:N'],
          ['many-to-many', 'N:N'],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() =>
              updateRelationship(relationship.id, {
                type: value as Relationship['type'],
              })
            }
            className={`
        rounded-lg
        border
        py-2
        text-sm
        transition
        ${
          relationship.type === value
            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
            : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
        }
      `}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Source
          </label>

          <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
            {sourceTable?.name}.{sourceColumn?.name}
          </div>
        </div>

        <div className="text-center text-zinc-500">↓</div>

        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Target
          </label>

          <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
            {targetTable?.name}.{targetColumn?.name}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 p-5">
        <button
          onClick={() => deleteRelationship(relationship.id)}
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
          Delete Relationship
        </button>
      </div>
    </div>
  );
}
