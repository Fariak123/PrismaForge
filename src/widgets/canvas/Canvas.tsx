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
// import { useMemo } from "react";
import { useSchemaStore } from "../../entities/schema/schema.store";
import Toolbar from "../toolbar";

const nodeTypes = {
  table: TableNode,
};

const initialNodes = [
  {
    id: "user",
    type: "table",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      name: "User",
      columns: [
        {
          id: "1",
          name: "id",
          type: "Int",
          primaryKey: true,
        },
        {
          id: "2",
          name: "email",
          type: "String",
        },
        {
          id: "3",
          name: "password",
          type: "String",
        },
        {
          id: "4",
          name: "createdAt",
          type: "DateTime",
        },
      ],
    },
  },
];

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const tables = useSchemaStore((state) => state.tables);
    // const nodes = useMemo(() => tablesToNodes(tables), [tables]);

    const handleAddTable = () => {
        setNodes((nodes) => [
            ...nodes,
        {
            id: crypto.randomUUID(),
            type: "table",
            position: {
                x: 300 + Math.random() * 100,
                y: 200 + Math.random() * 100,
            },
            data: {
                name: "NewTable",
                columns: [],
            },
        },
    ]);
};

  return (
    <div className="relative h-screen w-screen bg-zinc-950">
      <Toolbar onAddTable={handleAddTable} />
      <div className="h-full pt-14">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
  <Background
    variant={BackgroundVariant.Dots}
    gap={24}
    size={1.2}
  />

  <MiniMap
    pannable
    zoomable
  />

  <Controls />
</ReactFlow>
      </div>
      
    </div>
  );
}