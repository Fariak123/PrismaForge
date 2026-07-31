import { create } from "zustand";

interface EditorStore {

  selectedTableId: string | null;
  selectedRelationshipId: string | null,

  selectTable: (
    id: string | null
  ) => void;

  selectRelationship: (
    id: string | null
  ) => void;
}

export const useEditorStore = create<EditorStore>(
  (set) => ({
    selectedTableId: null,
    selectedRelationshipId: null,
      
    selectTable: (id) =>
      set({
        selectedTableId: id,
        selectedRelationshipId: null,
      }),

    selectRelationship: (id) =>
      set({
        selectedRelationshipId: id,
        selectedTableId: null,
      }),
  })
);