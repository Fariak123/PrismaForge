import { create } from "zustand";

import type { Table, Relationship } from "../../entities/schema";
import type { TableColumn } from "../table/table.types";

interface SchemaStore {
  tables: Table[];
  relationships: Relationship[];

  addTable: () => Table;
  moveTable: (id: string, x: number, y: number) => void;
  renameTable: (id: string, name: string) => void;

  addColumn: (tableId: string) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<TableColumn>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;

  addRelationship: (relationship: Relationship) => void;
  removeRelationship: (id: string) => void;
}

function getColumn(
  tables: Table[],
  tableId: string,
  columnId: string
) {
  const table = tables.find(
    (table) => table.id === tableId
  );

  return table?.columns.find(
    (column) => column.id === columnId
  );
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
  nodes: [],

  relationships: [],

  addTable: () => {
    const table: Table = {
      id: crypto.randomUUID(),
      name: "NewTable",
      position: {
        x: 300,
        y: 300,
      },
      columns: [
        {
      id: crypto.randomUUID(),
      name: "id",
      type: "Int",
      primaryKey: true,
      nullable: false,
      unique: true,
    },
      ],
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

    addColumn: (tableId) =>
      set((state) => ({
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
              ...table,
              columns: [
                ...table.columns,
                {
                  id: crypto.randomUUID(),
                  name: "new_column",
                  type: "String",
                  primaryKey: false,
                  nullable: true,
                  unique: false,
                },
              ],
            }
            : table
        ),
      })),

      updateColumn: (
  tableId,
  columnId,
  updates
) =>
set((state) => ({
  tables: state.tables.map((table) =>
    table.id === tableId
      ? {
          ...table,
          columns: table.columns.map((column) =>
            column.id === columnId
              ? {
                  ...column,
                  ...updates,
                }
              : column
          ),
        }
      : table
  ),
})),

deleteColumn: (
  tableId,
  columnId
) =>
set((state) => ({
  tables: state.tables.map((table) =>
    table.id === tableId
      ? {
          ...table,
          columns: table.columns.filter(
            (column) =>
              column.id !== columnId
          ),
        }
      : table
  ),
})),

    addRelationship: (relationship) =>
  set((state) => {
    const sourceColumn = getColumn(
      state.tables,
      relationship.sourceTableId,
      relationship.sourceColumnId
    );
    const targetColumn = getColumn(
      state.tables,
      relationship.targetTableId,
      relationship.targetColumnId
    );
    if (!sourceColumn || !targetColumn) {
      return state;
    }
    // PK -> FK
    if (sourceColumn.primaryKey) {
      return {
        relationships: [
          ...state.relationships,
          relationship,
        ],
      };
    }
    // Reverse connection:
    // FK -> PK
    if (targetColumn.primaryKey) {
      return {
        relationships: [
          ...state.relationships,
          {
            ...relationship,
            sourceTableId:
              relationship.targetTableId,
            targetTableId:
              relationship.sourceTableId,
            sourceColumnId:
              relationship.targetColumnId,
            targetColumnId:
              relationship.sourceColumnId,
          },
        ],
      };
    }
    return state;
  }),

    removeRelationship: (id) =>
      set((state) => ({
        relationships:
          state.relationships.filter(
            (r) => r.id !== id
          ),
      })),

}));