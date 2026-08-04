import { create } from 'zustand';
import type { Table, Relationship } from '../../entities/schema';
import type { TableColumn } from '../table/table.types';
import type { SchemaSnapshot } from '../history/history.types';
import { useHistoryStore } from '../history/history.store';

interface SchemaStore {
  tables: Table[];
  relationships: Relationship[];

  isDirty: boolean;

  setDirty: (value: boolean) => void;

  markSaved: () => void;

  selectedTableId: string | null;
  selectedRelationshipId: string | null;

  selectTable: (id: string | null) => void;
  selectRelationship: (id: string | null) => void;

  addTable: () => Table;
  moveTable: (id: string, x: number, y: number) => void;
  renameTable: (id: string, name: string) => void;
  deleteTable: (id: string) => void;

  addColumn: (tableId: string) => string;
  updateColumn: (
    tableId: string,
    columnId: string,
    updates: Partial<TableColumn>,
  ) => void;
  deleteColumn: (tableId: string, columnId: string) => void;

  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;

  loadProject: (tables: Table[], relationships: Relationship[]) => void;

  clearSchema: () => void;

  getSnapshot: () => SchemaSnapshot;
  replaceSnapshot: (snapshot: SchemaSnapshot) => void;
}

function getColumn(tables: Table[], tableId: string, columnId: string) {
  const table = tables.find((table) => table.id === tableId);

  return table?.columns.find((column) => column.id === columnId);
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  tables: [
    {
      id: 'user',
      name: 'User',
      position: { x: 100, y: 100 },

      columns: [
        {
          id: '1',
          name: 'id',
          type: 'Int',
          primaryKey: true,
          nullable: false,
          unique: true,
        },
        {
          id: '2',
          name: 'email',
          type: 'String',
          primaryKey: false,
          nullable: false,
          unique: true,
        },
      ],
    },
  ],
  nodes: [],

  relationships: [],

  isDirty: false,

  setDirty: (value) =>
    set({
      isDirty: value,
    }),

  markSaved: () =>
    set({
      isDirty: false,
    }),

  selectedTableId: null,
  selectedRelationshipId: null,

  selectTable: (id) =>
    set({
      selectedTableId: id,
    }),

  selectRelationship: (id) =>
    set({
      selectedRelationshipId: id,
    }),

  addTable: () => {
    const table: Table = {
      id: crypto.randomUUID(),
      name: 'NewTable',
      position: {
        x: 300,
        y: 300,
      },
      columns: [
        {
          id: crypto.randomUUID(),
          name: 'id',
          type: 'Int',
          primaryKey: true,
          nullable: false,
          unique: true,
        },
      ],
    };

    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => ({
      tables: [...state.tables, table],
      isDirty: true,
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
          : table,
      ),
      isDirty: true,
    })),

  renameTable: (id, name) => {
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id
          ? {
              ...table,
              name,
            }
          : table,
      ),
      isDirty: true,
    }))},

  deleteTable: (id) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => ({
      tables: state.tables.filter((table) => table.id !== id),

      relationships: state.relationships.filter(
        (relationship) =>
          relationship.sourceTableId !== id &&
          relationship.targetTableId !== id,
      ),

      selectedTableId:
        state.selectedTableId === id ? null : state.selectedTableId,

      isDirty: true,
    }))},

  addColumn: (tableId) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    const columnId = crypto.randomUUID();
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: [
                ...table.columns,
                {
                  id: columnId,
                  name: 'new_column',
                  type: 'String',
                  primaryKey: false,
                  nullable: true,
                  unique: false,
                },
              ],
            }
          : table,
      ),
      isDirty: true,
    }))
    return columnId;
  },

  updateColumn: (tableId, columnId, updates) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

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
                  : column,
              ),
            }
          : table,
      ),
      isDirty: true,
    }))},

  deleteColumn: (tableId, columnId) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.filter((column) => column.id !== columnId),
            }
          : table,
      ),
      isDirty: true,
    }))},

  addRelationship: (relationship) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => {
      const sourceColumn = getColumn(
        state.tables,
        relationship.sourceTableId,
        relationship.sourceColumnId,
      );
      const targetColumn = getColumn(
        state.tables,
        relationship.targetTableId,
        relationship.targetColumnId,
      );
      if (!sourceColumn || !targetColumn) {
        return state;
      }
      // PK -> FK
      if (sourceColumn.primaryKey) {
        return {
          relationships: [...state.relationships, relationship],
          isDirty: true,
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
              sourceTableId: relationship.targetTableId,
              targetTableId: relationship.sourceTableId,
              sourceColumnId: relationship.targetColumnId,
              targetColumnId: relationship.sourceColumnId,
            },
          ],
          isDirty: true,
        };
      }
      return state;
    })},

  updateRelationship: (id, updates) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => ({
      relationships: state.relationships.map((relationship) =>
        relationship.id === id
          ? {
              ...relationship,
              ...updates,
            }
          : relationship,
      ),
      isDirty: true,
    }))},

  deleteRelationship: (id) => {
    useHistoryStore
        .getState()
        .push(
            get().getSnapshot()
        );

    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== id),
      selectedRelationshipId: null,
      isDirty: true,
    }))},

  loadProject: (tables, relationships) =>
    set({
      tables,
      relationships,
      selectedTableId: null,
      selectedRelationshipId: null,
      isDirty: false,
    }),

  clearSchema: () =>
    set({
      tables: [],

      relationships: [],

      selectedTableId: null,

      selectedRelationshipId: null,

      isDirty: false,
    }),

  getSnapshot: () => ({
    tables: structuredClone(get().tables),
    relationships: structuredClone(get().relationships),
  }),

  replaceSnapshot: (snapshot) =>
    set({
      tables: structuredClone(snapshot.tables),
      relationships: structuredClone(snapshot.relationships),
    }),
}));
