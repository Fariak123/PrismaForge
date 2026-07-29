import { create } from "zustand";

import type { Table, Relationship } from "../../entities/schema";

interface SchemaStore {
  tables: Table[];
  relationships: Relationship[];

  selectedTableId: string | null;

  addTable: () => Table;
  moveTable: (id: string, x: number, y: number) => void;
  selectTable: (id: string | null) => void;

  renameTable: (id: string, name: string) => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  tables: [
    {
      id: "user",
      name: "User",
      position: { x: 100, y: 100 },

      columns: [
        {
          id: "1",
          name: "id",
          type: "Int",
          primaryKey: true,
          nullable: false,
          unique: true,
        },
        {
          id: "2",
          name: "email",
          type: "String",
          primaryKey: false,
          nullable: false,
          unique: true,
        },
      ],
    },
  ],

  relationships: [],

  selectedTableId: null,

  addTable: () => {
    const table: Table = {
      id: crypto.randomUUID(),
      name: "NewTable",
      position: {
        x: 300,
        y: 300,
      },
      columns: [],
    };

  set((state) => ({
    tables: [...state.tables, table],
  }));

  return table;
},

  moveTable: (id, x, y) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id
          ? {
              ...table,
              position: { x, y },
            }
          : table
      ),
    })),

  selectTable: (id) =>
    set({
      selectedTableId: id,
    }),

  renameTable: (id, name) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id
          ? {
            ...table,
            name,
          }
        : table
      ),
    })),
}));