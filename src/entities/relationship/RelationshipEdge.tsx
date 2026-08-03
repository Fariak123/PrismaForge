import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

type RelationshipEdgeData = {
  relationshipType?: string;
};

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

  const relationship = data as RelationshipEdgeData | undefined;

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
          className="
            rounded-md
            border
            border-zinc-700
            bg-zinc-900
            px-2
            py-1
            text-xs
            text-zinc-300
          "
        >
          {relationship?.relationshipType ?? '1:N'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
