import { useSchemaStore } from "../../entities/schema/schema.store";

export function useSelectedTable() {
  return useSchemaStore((state) =>
    state.tables.find(
      (table) => table.id === state.selectedTableId
    )
  );
}