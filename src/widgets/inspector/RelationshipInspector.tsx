import { useSelectedRelationship } from '../../features/canvas/editor.selectors';
import { useSchemaStore } from '../../entities/schema/schema.store';
import type {
  ReferentialAction,
  Relationship,
} from '../../entities/schema/schema.types';
import Select from '../../app/components/ui/Select';

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
      <div className="border-b border-t border-zinc-800 p-5">
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

      <div className="flex-1 overflow-y-auto p-5">
        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Source
          </label>

          <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
            {sourceTable?.name}.{sourceColumn?.name}
          </div>
        </div>

        <div className="text-center text-zinc-500 pt-4">↓</div>

        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Target
          </label>

          <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
            {targetTable?.name}.{targetColumn?.name}
          </div>
        </div>
        <div className="space-y-4 pt-8">
          <div>
            <label
              className="
      text-xs
      uppercase
      tracking-wide
      text-zinc-500
    "
            >
              On Delete
            </label>

            <Select
              value={relationship.onDelete ?? 'Cascade'}
              options={[
                'Cascade',
                'Restrict',
                'NoAction',
                'SetNull',
                'SetDefault',
              ]}
              onChange={(value) =>
                updateRelationship(relationship.id, {
                  onDelete: value as ReferentialAction,
                })
              }
            />
          </div>

          <div>
            <label
              className="
      text-xs
      uppercase
      tracking-wide
      text-zinc-500
    "
            >
              On Update
            </label>

            <Select
              value={relationship.onUpdate ?? 'Cascade'}
              options={[
                'Cascade',
                'Restrict',
                'NoAction',
                'SetNull',
                'SetDefault',
              ]}
              onChange={(value) =>
                updateRelationship(relationship.id, {
                  onUpdate: value as ReferentialAction,
                })
              }
            />
          </div>
        </div>
        <label
          className="
 flex
 items-center
 gap-3
 text-sm
 text-zinc-300
 pt-4
 "
        >
          <input
            type="checkbox"
            checked={relationship.optional ?? false}
            onChange={(e) =>
              updateRelationship(relationship.id, {
                optional: e.target.checked,
              })
            }
          />
          Optional relation
        </label>
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
