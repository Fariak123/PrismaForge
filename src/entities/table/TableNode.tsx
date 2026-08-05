import { memo } from 'react';
import {
  Handle,
  type NodeProps,
  Position,
  useUpdateNodeInternals,
} from '@xyflow/react';
import type { TableNodeType } from './table.types';
import { Database, KeyRound, Circle } from 'lucide-react';
import { useEffect } from 'react';
import { useEditorStore } from '../../features/canvas/editor.store';

function TableNode({ id, data, selected }: NodeProps<TableNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();

  const highlighted = useEditorStore((state) => state.highlightedNodeId === id);
  const highlightColumn = useEditorStore((state) => state.highlightColumn);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, data.columns.length, updateNodeInternals]);

  const handleFocusColumn = (columnId: string) => {
    highlightColumn(columnId);
  };

  return (
    <div
      className={`
        w-72
        overflow-hidden
        rounded-xl
        border
        bg-[#1E1E2E]
        shadow-xl
        transition-all
        duration-200

        ${
          selected
            ? 'border-blue-500 shadow-blue-500/20'
            : 'border-zinc-700 hover:border-zinc-500'
        }

        ${
          highlighted
            ? `
            border-yellow-400
            shadow-lg
            animate-ping-highlight
            pointer-events-none
          `
            : `
            border-zinc-700 hover:border-zinc-500
          `
        }
      `}
    >
      <div className="flex items-center gap-2 border-b border-zinc-700 bg-[#27293D] px-4 py-3">
        <Database size={18} className="text-blue-400" />

        <span className="font-semibold text-white">{data.name}</span>
      </div>

      <div>
        {data.columns.map((column) => (
          <button
            onClick={() => handleFocusColumn(column.id)}
            key={column.id}
            className={`
              group
              relative
              flex
              w-full
              h-10
              border-b 
              border-zinc-800
              items-center
              justify-between
              px-4
              text-sm
              last:border-none
              hover:bg-zinc-800/40
            `}
          >
            <Handle
              type="target"
              id={`target-${column.id}`}
              position={Position.Left}
              className={`
                !left-1
                !h-3
                !w-1
                !rounded-full
                !border-none
                !bg-sky-400
                opacity-0
                transition-all
                duration-150
                group-hover:opacity-100
                group-hover:shadow-[0_0_10px_#38bdf8]
              `}
            />
            <div className="flex items-center gap-2">
              {column.primaryKey ? (
                <KeyRound size={14} className="text-yellow-400" />
              ) : (
                <Circle size={8} className="fill-zinc-500 text-zinc-500" />
              )}

              <span className="text-zinc-100">{column.name}</span>
            </div>

            <span className="min-w-20 rounded-md bg-zinc-800 px-2 py-1 text-center text-[11px] font-medium text-zinc-400">
              {column.type}
            </span>

            <Handle
              type="source"
              id={`source-${column.id}`}
              position={Position.Right}
              className={`
              !right-1
              !h-3
              !w-1
              !rounded-full
              !border-none
              !bg-sky-400
              opacity-0
              transition-all
              duration-150
              group-hover:opacity-100
              group-hover:shadow-[0_0_10px_#38bdf8]
            `}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(TableNode);
