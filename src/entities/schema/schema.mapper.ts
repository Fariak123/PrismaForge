import type { Relationship, Table } from './schema.types';
import type { RelationshipEdge } from '../relationship/relationship.types';
import type { Node } from '@xyflow/react';
import type { TableNodeData } from '../table/table.types';

export function relationshipsToEdges(
  relationships: Relationship[],
): RelationshipEdge[] {
  return relationships.map((relationship) => ({
    id: relationship.id,

    source: relationship.sourceTableId,
    target: relationship.targetTableId,

    sourceHandle: `source-${relationship.sourceColumnId}`,

    targetHandle: `target-${relationship.targetColumnId}`,

    type: 'relationship',

    animated: true,

    data: {
      type: relationship.type,

      sourceColumnId: relationship.sourceColumnId,

      targetColumnId: relationship.targetColumnId,
    },
  }));
}

export function tablesToNodes(tables: Table[]): Node<TableNodeData>[] {
  return tables.map((table) => ({
    id: table.id,

    type: 'table',

    position: table.position,

    data: {
      name: table.name,
      columns: table.columns,
    },
  }));
}
