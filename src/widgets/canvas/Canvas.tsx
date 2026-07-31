import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  type Connection,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "../../entities/table/TableNode";
import Toolbar from "../toolbar";
import Inspector from "../inspector";
import { useEditorStore } from "../../features/canvas/editor.store";
import RelationshipEdge from "../../entities/relationship/RelationshipEdge";
import { useEffect, useMemo } from "react";
import { generatePrisma } from "../../features/export/prisma.generator";
import { useSchemaStore } from "../../entities/schema/schema.store";
import {
  relationshipsToEdges,
  tablesToNodes,
} from "../../entities/schema/schema.mapper";
import type { TableNodeData } from "../../entities/table/table.types";

const nodeTypes = {
  table: TableNode,
};


export default function Canvas() {
    const tables = useSchemaStore((s) => s.tables);

    const schemaNodes = useMemo<Node<TableNodeData>[]>(
      () => tablesToNodes(tables),
    [tables]);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node<TableNodeData>>(schemaNodes);

    const relationships = useSchemaStore(
      (s) => s.relationships
    );

    const edges = useMemo(
        () => relationshipsToEdges(relationships),
    [relationships]);

    const addTable = useSchemaStore(
      (state) => state.addTable
    );

    const selectTable = useEditorStore(
      (state) => state.selectTable
    );

    const selectRelationship = useEditorStore(
      (state) => state.selectRelationship
    );

    const edgeTypes = {
      relationship: RelationshipEdge,
    };

    const addRelationship = useSchemaStore(
      (s) => s.addRelationship
    );

    const moveTable = useSchemaStore(
      (state) => state.moveTable
    );

    const handleExport = () => {
      const prisma = generatePrisma(tables, relationships);
    };

    const handleConnect = (
  connection: Connection
) => {

  if (
    !connection.source ||
    !connection.target ||
    !connection.sourceHandle ||
    !connection.targetHandle
  ) {
    return;
  }

  addRelationship({
    id: crypto.randomUUID(),

    sourceTableId:
      connection.source,

    targetTableId:
      connection.target,

    sourceColumnId:
      connection.sourceHandle.replace(
        "source-",
        ""
      ),

    targetColumnId:
      connection.targetHandle.replace(
        "target-",
        ""
      ),

    type: "one-to-many",
  });
};

    useEffect(() => {
        setNodes(schemaNodes);
    }, [schemaNodes, setNodes]);


  return (
    <div className="relative h-screen w-screen bg-zinc-950">
      <Toolbar onAddTable={addTable} onExport={handleExport} />
      <Inspector />
      <div className="h-full pt-14 pr-80">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          fitView
          minZoom={0.3}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          onNodeClick={(_, node) => {
            selectTable(node.id);
          }}
          onPaneClick={() => {
            selectTable(null);
            selectRelationship(null);
          }}
          onConnect={handleConnect}
          onNodeDragStop={(_, node) => {
            moveTable(
                node.id,
                node.position.x,
                node.position.y
            )
          }}
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