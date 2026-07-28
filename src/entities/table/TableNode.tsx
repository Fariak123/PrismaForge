import { memo } from "react";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { TableNodeType } from "./table.types";
import {
  Database,
  KeyRound,
  Circle,
} from "lucide-react";

function TableNode({ data, selected }: NodeProps<TableNodeType>) {
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
            ? "border-blue-500 shadow-blue-500/20"
            : "border-zinc-700 hover:border-zinc-500"
        }
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-none !bg-blue-500"
      />

      <div className="flex items-center gap-2 border-b border-zinc-700 bg-[#27293D] px-4 py-3">
        <Database size={18} className="text-blue-400" />

        <span className="font-semibold text-white">
          {data.name}
        </span>
      </div>

      <div>
        {data.columns.map((column) => (
          <div
            key={column.id}
            className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-sm last:border-none hover:bg-zinc-800/40"
          >
            <div className="flex items-center gap-2">
              {column.primaryKey ? (
                <KeyRound
                  size={14}
                  className="text-yellow-400"
                />
              ) : (
                <Circle
                  size={8}
                  className="fill-zinc-500 text-zinc-500"
                />
              )}

              <span className="text-zinc-100">
                {column.name}
              </span>
            </div>

            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {column.type}
            </span>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-none !bg-blue-500"
      />
    </div>
  );
}

export default memo(TableNode);