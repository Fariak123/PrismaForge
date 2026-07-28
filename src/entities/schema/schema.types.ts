export interface Position {
  x: number;
  y: number;
}

export type DataType =
  | "Int"
  | "BigInt"
  | "String"
  | "Boolean"
  | "Float"
  | "Decimal"
  | "DateTime"
  | "Json";

export interface Column {
  id: string;
  name: string;
  type: DataType;

  primaryKey: boolean;
  nullable: boolean;
  unique: boolean;
}

export interface Table {
  id: string;
  name: string;

  position: Position;

  columns: Column[];
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