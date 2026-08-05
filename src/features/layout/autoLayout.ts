import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

export function autoLayout(nodes: Node[], edges: Edge[]) {
  dagreGraph.setGraph({
    rankdir: 'LR',

    ranksep: 180,

    nodesep: 80,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 260,

      height: 180,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);

    return {
      ...node,

      position: {
        x: pos.x - 130,

        y: pos.y - 90,
      },
    };
  });
}
