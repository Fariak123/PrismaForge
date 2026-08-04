import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import type { RelationshipData, RelationshipType } from './relationship.types';

function relationshipLabel(
  type: RelationshipType
) {
  switch(type){

    case 'one-to-one':
      return '1:1';

    case 'one-to-many':
      return '1:N';

    case 'many-to-many':
      return 'N:N';
    default:
      return undefined;
  }
}

export default function RelationshipEdge({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
}: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationship = data as RelationshipData | undefined;

  return (
    <>
      <BaseEdge path={path} style={{ strokeWidth: 2, opacity: 0.8 }} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'none',
          }}
          className={`
          ${relationship && `
            rounded-md
            border
            border-zinc-700
            bg-zinc-900
            px-2
            py-1
            text-xs
            text-zinc-300`}
          `}
        >
          {relationship?.type
            ? relationshipLabel(relationship.type)
            : ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
