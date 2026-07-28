import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import TableNode from "../../entities/table/TableNode";

const nodeTypes = {
  table: TableNode,
};

const initialNodes = [
  {
    id: "1",
    type: "table",
    position: { x: 200, y: 120 },
    data: {
      name: "User",
      columns: [
        {
          name: "id",
          type: "Int",
          pk: true,
        },
        {
          name: "email",
          type: "String",
        },
        {
          name: "password",
          type: "String",
        },
      ],
    },
  },
];

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <div className="h-screen w-screen bg-zinc-950">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
        />

        <MiniMap />

        <Controls />
      </ReactFlow>
    </div>
  );
}