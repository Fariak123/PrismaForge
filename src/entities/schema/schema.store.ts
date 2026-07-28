import { create } from "zustand";
import { nanoid } from "nanoid";

import type { Table, Relationship } from "../../entities/schema";

interface SchemaStore {
  tables: Table[];
  relationships: Relationship[];

  addTable: () => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  tables: [],
  relationships: [],

  addTable: () =>
    set((state) => ({
      tables: [
        ...state.tables,
        {
          id: nanoid(),
          name: "NewTable",
          position: { x: 200, y: 200 },
          columns: [],
        },
      ],
    })),
}));