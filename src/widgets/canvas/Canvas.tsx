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
import RelationshipEdge from "../../entities/relationship/RelationshipEdge";
import { useEffect, useMemo, useState } from "react";
import { generatePrisma } from "../../features/export/prisma.generator";
import { useSchemaStore } from "../../entities/schema/schema.store";
import {
  relationshipsToEdges,
  tablesToNodes,
} from "../../entities/schema/schema.mapper";
import type { TableNodeData } from "../../entities/table/table.types";
import { useSelectedRelationship, useSelectedTable } from "../../features/canvas/editor.selectors";
import ExportModal from "../../widgets/export/ExportModal";

const nodeTypes = {
  table: TableNode,
};


export default function Canvas() {
    const [showExport, setShowExport] = useState(false);
  
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

    const selectTable = useSchemaStore(
      (state) => state.selectTable
    );

    const selectRelationship = useSchemaStore(
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

    const prisma = useMemo(() =>
      generatePrisma(
        tables,
        relationships
      ), [tables, relationships]
    );

    const selectedTable = useSelectedTable();
    const selectedRelationship = useSelectedRelationship();

    const deleteTable = useSchemaStore(
      (s) => s.deleteTable
    );

    const deleteRelationship = useSchemaStore(
      (s) => s.deleteRelationship
    );

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

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Don't delete while typing
            const target = e.target as HTMLElement;
            if (
              target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.isContentEditable
            ) {
                return;
            }
            if (
              e.key !== "Delete" &&
              e.key !== "Backspace"
            ) {
                return;
            }
            if (selectedRelationship) {
                deleteRelationship(selectedRelationship.id);
                return;
            }
            if (selectedTable) {
                deleteTable(selectedTable.id);
            }
        }

        window.addEventListener(
          "keydown",
          handleKeyDown
        );

        return () =>
          window.removeEventListener(
            "keydown",
            handleKeyDown
          );

    }, [
      selectedTable,
      selectedRelationship,
      deleteTable,
      deleteRelationship,
    ]);

  return (
    <div className="relative h-screen w-screen bg-zinc-950">
      <Toolbar onAddTable={addTable} onGenerateSchema={() => setShowExport(true)} />
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
            selectRelationship(null);
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
          onEdgeClick={(_, edge) => {
            selectRelationship(edge.id);
            selectTable(null);
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
      {showExport && (
    <ExportModal
      prisma={prisma}
      onClose={() =>
        setShowExport(false)
      }
    />
  )}
    </div>
  );
}