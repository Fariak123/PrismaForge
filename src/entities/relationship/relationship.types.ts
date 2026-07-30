export type RelationshipType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-many";


export interface RelationshipData extends Record<string, unknown> {
  type: RelationshipType;

  sourceColumn?: string;
  targetColumn?: string;
}