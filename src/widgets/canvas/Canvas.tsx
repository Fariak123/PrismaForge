import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useNodesState,
  useReactFlow,
  type Connection,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TableNode from '../../entities/table/TableNode';
import Toolbar from '../toolbar';
import Inspector from '../inspector';
import RelationshipEdge from '../../entities/relationship/RelationshipEdge';
import { useEffect, useMemo, useRef } from 'react';
import { generatePrisma } from '../../features/export/prisma.generator';
import { useSchemaStore } from '../../entities/schema/schema.store';
import {
  relationshipsToEdges,
  tablesToNodes,
} from '../../entities/schema/schema.mapper';
import type { TableNodeData } from '../../entities/table/table.types';
import {
  useSelectedRelationship,
  useSelectedTable,
} from '../../features/canvas/editor.selectors';
import ExportModal from '../../widgets/export/ExportModal';
import IssuesModal from '../issues/IssuesModal';
import type { Table } from '../../entities/schema';
import { useProject } from '../../features/project/useProject';
import DialogModal from '../dialog/DialogModal';
import { useEditorStore } from '../../features/canvas/editor.store';
import type { SchemaSnapshot } from '../../entities/history/history.types';
import { useHistoryStore } from '../../entities/history/history.store';
import { autoLayout } from '../../features/layout/autoLayout';
import FloatingActions from '../../features/floatingActions/FloatingActions';

const nodeTypes = {
  table: TableNode,
};

export function focusTable(
  table: Table,
  setCenter: ReactFlowInstance['setCenter'],
  selectTable: (id: string) => void,
) {
  selectTable(table.id);

  setCenter(table.position.x + 150, table.position.y + 80, {
    zoom: 1.2,
    duration: 500,
  });
}

export default function Canvas() {
  const reactFlow = useReactFlow();

  const tables = useSchemaStore((s) => s.tables);

  const relationships = useSchemaStore((s) => s.relationships);

  const project = useProject();

  const isDirty = useSchemaStore((s) => s.isDirty);

  const schemaNodes = useMemo<Node<TableNodeData>[]>(
    () => tablesToNodes(tables),
    [tables],
  );

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<TableNodeData>>(schemaNodes);

  const edges = useMemo(
    () => relationshipsToEdges(relationships),
    [relationships],
  );

  const addTable = useSchemaStore((state) => state.addTable);

  const selectTable = useSchemaStore((state) => state.selectTable);

  const highlightNode = useEditorStore((state) => state.highlightNode);

  const highlightColumn = useEditorStore((state) => state.highlightColumn);

  const selectRelationship = useSchemaStore(
    (state) => state.selectRelationship,
  );

  const edgeTypes = {
    relationship: RelationshipEdge,
  };

  const addRelationship = useSchemaStore((s) => s.addRelationship);

  const moveTable = useSchemaStore((state) => state.moveTable);

  const prisma = useMemo(
    () => generatePrisma(tables, relationships),
    [tables, relationships],
  );

  const selectedTable = useSelectedTable();
  const selectedRelationship = useSelectedRelationship();

  const deleteTable = useSchemaStore((s) => s.deleteTable);

  const deleteRelationship = useSchemaStore((s) => s.deleteRelationship);

  const handleConnect = (connection: Connection) => {
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

      sourceTableId: connection.source,

      targetTableId: connection.target,

      sourceColumnId: connection.sourceHandle.replace('source-', ''),

      targetColumnId: connection.targetHandle.replace('target-', ''),

      type: 'one-to-many',
    });
  };

  const handleFocusTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    selectTable(table.id);

    reactFlow.setCenter(table.position.x + 150, table.position.y + 80, {
      zoom: 1.2,
      duration: 500,
    });

    setTimeout(() => {
        highlightNode(table.id);
    }, 350)
  };

  const handleFocusColumn = (tableId: string, columnId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    selectTable(tableId);
    reactFlow.setCenter(table.position.x + 150, table.position.y + 80, {
      zoom: 1.2,
      duration: 500,
    });

    setTimeout(() => {
        highlightColumn(columnId);
  }, 350);
  }

  const dragSnapshot = useRef<SchemaSnapshot>(null);

  const handleNodeDragStart = () => {
    dragSnapshot.current =
      useSchemaStore
        .getState()
        .getSnapshot();
  };

  const handleNodeDragStop = () => {
    if (!dragSnapshot.current) {
        return;
    }

    const before =
      dragSnapshot.current.tables;

    const after =
      useSchemaStore
        .getState()
        .tables;


    const changed =
      JSON.stringify(before)
      !==
      JSON.stringify(after);


    if (changed) {
      useHistoryStore
        .getState()
        .push(
          dragSnapshot.current
        );
    }

    dragSnapshot.current = null;
  };

  const handleAutoLayout = () => {
    useHistoryStore
      .getState()
      .push(
        useSchemaStore
          .getState()
          .getSnapshot()
      )
    const layouted =
        autoLayout(
            nodes,
            edges
        );

    layouted.map((node => moveTable(node.id, node.position.x, node.position.y)))
}

const handleFitView = () => {
    reactFlow.fitView({
        duration: 700,

        padding: 0.15,

    });
};

const handleCenter = () => {
    reactFlow.setCenter(
        0,
        0,
        {
            duration: 700,
            zoom: 1,
        }
    );
};

  useEffect(() => {
    setNodes(schemaNodes);
  }, [schemaNodes, setNodes]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key !== 'Delete' && e.key !== 'Backspace') {
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

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTable, selectedRelationship, deleteTable, deleteRelationship]);

  return (
    <div className="relative h-screen w-screen bg-zinc-950">
      <Toolbar
        onAddTable={() => {
          const table = addTable();
          selectTable(table.id);
          reactFlow.setCenter(table.position.x + 150, table.position.y + 80, {
            zoom: 1,
            duration: 600,
          });
        }}
        onNewProject={project.newProject}
        onGenerateSchema={project.prismaGenerateSchema}
        onSaveProject={project.saveProject}
        isDirty={isDirty}
        onOpenProject={project.pickProject}
      />
      <input
        hidden
        ref={project.inputRef}
        type="file"
        accept=".prismaforge"
        onChange={project.handleFileSelected}
      />
      <DialogModal
        open={project.dialog.open}
        title={project.dialog.title}
        description={project.dialog.description}
        confirmText={project.dialog.confirmText}
        cancelText={project.dialog.cancelText}
        confirmVariant={
          project.dialog.confirmVariant as 'primary' | 'danger' | undefined
        }
        onConfirm={project.dialog.onConfirm}
        onCancel={project.closeDialog}
      />
      <Inspector onFocusTable={handleFocusTable} />
      <div className="relative h-full w-full pt-14 pr-80">
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
            moveTable(node.id, node.position.x, node.position.y);
            handleNodeDragStop();
          }}
          onEdgeClick={(_, edge) => {
            selectRelationship(edge.id);
            selectTable(null);
          }}
          onNodeDragStart={handleNodeDragStart}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} />
          <MiniMap pannable zoomable />
        </ReactFlow>

        <FloatingActions
          onAutoLayout={handleAutoLayout}
          onFitView={handleFitView}
          onCenter={handleCenter}
        />
      </div>
      {project.issuesOpen && (
        <IssuesModal
          issues={project.issues}
          onClose={project.closeIssues}
          onContinue={project.forceSave}
          onSelectTable={handleFocusTable}
          onSelectColumn={handleFocusColumn}
        />
      )}

      {project.prismaViewerOpen && (
        <ExportModal
          prisma={prisma}
          onClose={() => project.setPrismaViewerOpen(false)}
        />
      )}
    </div>
  );
}
