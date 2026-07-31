import type {
  TableColumn
} from "../table/table.types";

export interface Position {
  x: number;
  y: number;
}

export interface Table {
  id: string;
  name: string;

  position: Position;

  columns: TableColumn[];
}

export type RelationshipType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-many";

export interface Relationship {
  id: string;

  sourceTableId: string;
  sourceColumnId: string;

  targetTableId: string;
  targetColumnId: string;

  type: RelationshipType;
}

export interface Schema {
  tables: Table[];
  relationships: Relationship[];
}