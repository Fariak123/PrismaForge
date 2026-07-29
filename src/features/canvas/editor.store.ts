import { create } from "zustand";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";

import type { TableNodeData } from "../../entities/table/table.types";


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
  })
);