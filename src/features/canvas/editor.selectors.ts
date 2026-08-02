import { useSchemaStore } from "../../entities/schema/schema.store";

export function useSelectedTable() {
  const selectedTableId = useSchemaStore (
    (state) => state.selectedTableId
  );

  return useSchemaStore((state) =>
    state.tables.find(
      (table) => table.id === selectedTableId
    )
  );
}

export function useSelectedRelationship() {
  const selectedRelationshipId = useSchemaStore (
    (state) => state.selectedRelationshipId
  );

  return useSchemaStore((state) => 
    state.relationships.find(
      (relationship) => relationship.id === selectedRelationshipId
    )
  );
}