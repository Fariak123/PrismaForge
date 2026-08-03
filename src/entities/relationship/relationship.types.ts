import type { Edge } from '@xyflow/react';

export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export interface RelationshipData extends Record<string, unknown> {
  relationshipType: RelationshipType;

  sourceColumnId: string;
  targetColumnId: string;
}

export interface RelationshipEdge extends Edge<RelationshipData> {
  data: RelationshipData;
}
