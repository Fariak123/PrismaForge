import type { Node } from '@xyflow/react';

export interface TableColumn {
  id: string;
  name: string;
  type: DataType;

  primaryKey?: boolean;
  nullable?: boolean;
  unique?: boolean;
}

export interface TableNodeData extends Record<string, unknown> {
  name: string;
  columns: TableColumn[];
}

export type TableNodeType = Node<TableNodeData, 'table'>;

export type DataType = 'String' | 'Int' | 'BigInt' | 'Float' | 'Decimal' | 'Boolean' | 'DateTime' | 'Json' | 'Bytes';

export const COLUMN_TYPES = [
  "String",
  "Int",
  "BigInt",
  "Float",
  "Decimal",
  "Boolean",
  "DateTime",
  "Json",
  "Bytes",
] as const;