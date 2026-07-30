import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TableNode from "../../entities/table/TableNode";
import Toolbar from "../toolbar";
import Inspector from "../inspector";
import { useEditorStore } from "../../features/canvas/editor.store";
import RelationshipEdge from "../../entities/relationship/RelationshipEdge";
import { useEffect } from "react";

const nodeTypes = {
  table: TableNode,
};


export default function Canvas() {
    const nodes = useEditorStore(
      (state) => state.nodes
    );

    const edges = useEditorStore(
      (state) => state.edges
    );

    const addTable = useEditorStore(
      (state) => state.addTable
    );

    const onNodesChange = useEditorStore(
      (state) => state.onNodesChange
    );

    const onEdgesChange = useEditorStore(
      (state) => state.onEdgesChange
    );

    const selectTable = useEditorStore(
      (state) => state.selectTable
    );

    const onConnect = useEditorStore(
      (state) => state.onConnect
    );

    const edgeTypes = {
      relationship: RelationshipEdge,
    };

    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        nodes.forEach((node) => {
            updateNodeInternals(node.id);
        });
    }, [nodes, updateNodeInternals]);

  return (
    <div className="relative h-screen w-screen bg-zinc-950">
      <Toolbar onAddTable={addTable} />
      <Inspector />
      <div className="h-full pt-14 pr-80">
        <ReactFlow
          nodes={nodes}
          edges={edges}

          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}

          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.3}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          onNodeClick={(_, node) => {
            selectTable(node.id);
          }}
          onPaneClick={() => {
            selectTable(null);
          }}
          onConnect={onConnect}
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