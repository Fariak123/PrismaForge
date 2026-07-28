import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

type Column = {
  name: string;
  type: string;
  pk?: boolean;
};

type TableData = {
  name: string;
  columns: Column[];
};

export default function TableNode({
  data,
}: NodeProps<Node<TableData>>) {
  return (
    <div className="min-w-64 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">

      <div className="border-b border-zinc-700 bg-zinc-800 px-4 py-3 font-semibold text-white">
        {data.name}
      </div>

      <div className="py-2">

        {data.columns.map((column) => (
          <div
            key={column.name}
            className="flex items-center justify-between px-4 py-1 text-sm hover:bg-zinc-800"
          >
            <span className="text-zinc-200">
              {column.pk ? "🔑 " : ""}
              {column.name}
            </span>

            <span className="text-zinc-500">
              {column.type}
            </span>
          </div>
        ))}

      </div>

      <Handle
        type="target"
        position={Position.Left}
      />

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}