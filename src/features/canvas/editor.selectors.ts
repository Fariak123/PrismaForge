import { useEditorStore } from "./editor.store";
import { useSchemaStore } from "../../entities/schema/schema.store";

export function useSelectedTable() {
  const selectedTableId = useEditorStore(
    (state) => state.selectedTableId
  );

  return useSchemaStore((state) =>
    state.tables.find(
      (table) => table.id === selectedTableId
    )
  );
}