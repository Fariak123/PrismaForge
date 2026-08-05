import {
  useSelectedRelationship,
  useSelectedTable,
} from '../../features/canvas/editor.selectors';
import SearchPanel from './SearchPanel';
import RelationshipInspector from './RelationshipInspector';
import TableInspector from './TableInspector';

interface Props {
  onFocusTable: (tableId: string) => void;
}

export default function Inspector({ onFocusTable }: Props) {
  const table = useSelectedTable();
  const relationship = useSelectedRelationship();

  return (
    <aside
      className="
        absolute
        right-0
        top-14
        z-40
        flex
        h-[calc(100vh-56px)]
        w-80
        flex-col
        border-l
        border-zinc-800
        bg-zinc-950
      "
    >
      <SearchPanel onSelect={onFocusTable} />

      <div className="flex-1 overflow-y-auto">
        {relationship ? (
          <RelationshipInspector />
        ) : table ? (
          <TableInspector />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-sm
              text-zinc-500
            "
          >
            Select a table or relationship
          </div>
        )}
      </div>
    </aside>
  );
}
