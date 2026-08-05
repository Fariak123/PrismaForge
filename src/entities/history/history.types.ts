import type { Relationship, Table } from '../schema/schema.types';

export type SchemaSnapshot = {
  tables: Table[];
  relationships: Relationship[];
};
