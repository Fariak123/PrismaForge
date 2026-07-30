import { create } from "zustand";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type Connection,
} from "@xyflow/react";

import type { TableNodeData } from "../../entities/table/table.types";
import type { TableColumn } from "../../entities/table/table.types";


export type TableNode = {
  id: string;
  type: "table";
  position: {
    x: number;
    y: number;
  };
  data: TableNodeData;
};

interface EditorStore {
  nodes: TableNode[];
  edges: Edge[];

  selectedNodeId: string | null;

  addTable: () => void;

  renameTable: (
    id: string,
    name: string
  ) => void;

  selectTable: (
    id: string | null
  ) => void;

  onNodesChange: (
    changes: NodeChange[]
  ) => void;

  onEdgesChange: (
    changes: EdgeChange[]
  ) => void;

  addColumn: (
    nodeId: string
  ) => void;

  updateColumn: (
    nodeId: string,
    columnId: string,
    updates: Partial<TableColumn>
  ) => void;

  deleteColumn: (
    nodeId: string,
    columnId: string
  ) => void;

  onConnect: (
    connection: Connection
  ) => void;
}


export const useEditorStore = create<EditorStore>(
  (set) => ({
    nodes: [
      {
        id: "user",
        type: "table",
        position: {
          x: 100,
          y: 100,
        },
        data: {
          name: "User",
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
      },
    ],

    edges: [],

    selectedNodeId: null,


    addTable: () =>
      set((state) => ({
        nodes: [
          ...state.nodes,
          {
            id: crypto.randomUUID(),
            type: "table",
            position: {
              x: 300,
              y: 300,
            },
            data: {
              name: "NewTable",
              columns: [],
            },
          },
        ],
      })),


    renameTable: (id, name) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  name,
                },
              }
            : node
        ),
      })),


    selectTable: (id) =>
      set({
        selectedNodeId: id,
      }),


    onNodesChange: (changes) =>
      set((state) => ({
        nodes: applyNodeChanges(
          changes,
          state.nodes
        ) as TableNode[],
      })),


    onEdgesChange: (changes) =>
      set((state) => ({
        edges: applyEdgeChanges(
          changes,
          state.edges
        ),
      })),

      addColumn: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
                ? {
                  ...node,
                  data: {
                    ...node.data,
                    columns: [
                      ...node.data.columns,
                    {
                      id: crypto.randomUUID(),
                      name: "new_column",
                      type: "String",
                      primaryKey: false,
                      nullable: true,
                      unique: false,
                    },
                    ],
                  },
                }
            : node
          ),
      })),

      updateColumn: (nodeId, columnId, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
            ? {
              ...node,
              data: {
                ...node.data,
                columns: node.data.columns.map((column) =>
                  column.id === columnId
                    ? {
                      ...column,
                      ...updates,
                    }
                    : column
                ),
              },
            }
            : node
          ),
      })),


      deleteColumn: (nodeId, columnId) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? {
                ...node,
                data: {
                  ...node.data,
                  columns: node.data.columns.filter(
                    (column) => column.id !== columnId
                  ),
                },
              }
            : node
          ),
      })),

      onConnect: (connection) =>
        set((state) => ({
          edges: [
            ...state.edges,
            {
              id: crypto.randomUUID(),
              source: connection.source!,
              target: connection.target!,
              sourceHandle: connection.sourceHandle,
              targetHandle: connection.targetHandle,

              type: "relationship",

              animated: true,

              data: {
                type: "one-to-many",
              },
            },
          ],
      })),
  })
);