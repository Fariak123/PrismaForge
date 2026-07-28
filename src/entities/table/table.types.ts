import type { Node } from "@xyflow/react";

export interface TableColumn {
  id: string;
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
  unique?: boolean;
}

export interface TableNodeData extends Record<string, unknown> {
  name: string;
  columns: TableColumn[];
}

export type TableNodeType = Node<TableNodeData, "table">;