import {
  useSelectedRelationship,
  useSelectedTable,
} from '../../features/canvas/editor.selectors';
import RelationshipInspector from './RelationshipInspector';
import TableInspector from './TableInspector';

export default function Inspector() {
  const table = useSelectedTable();
  const relationship = useSelectedRelationship();

  return (
    <aside className="absolute right-0 top-14 z-40 flex h-[calc(100vh-56px)] w-80 flex-col border-l border-zinc-800 bg-zinc-950">
      {relationship ? (
        <RelationshipInspector />
      ) : table ? (
        <TableInspector />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          Select a table or relationship
        </div>
      )}
    </aside>
  );
}
