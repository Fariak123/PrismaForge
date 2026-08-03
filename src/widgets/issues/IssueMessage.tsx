import { AlertTriangle, Database, Columns3 } from 'lucide-react';
import type { ValidationIssue } from '../../features/validation/validation.types';

interface Props {
  issue: ValidationIssue;
  onClose: () => void;
  onSelectTable?: (tableId: string) => void;
  onSelectColumn?: (tableId: string, columnId: string) => void;
}

export default function IssueMessage({
  issue,
  onClose,
  onSelectTable,
  onSelectColumn,
}: Props) {
  return (
    <div
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-4
        space-y-4
      "
    >
      {/* Header */}

      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-yellow-400" />

        <p className="text-sm leading-6 text-zinc-200">{issue.message}</p>
      </div>

      {/* Tables */}

      {issue.tableRefs?.length ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Tables
          </p>

          <div className="flex flex-wrap gap-2">
            {issue.tableRefs.map((table) => (
              <button
                key={table.id}
                onClick={() => {
                  onClose();
                  onSelectTable?.(table.id);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-blue-500/30
                  bg-blue-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-blue-300
                  transition
                  hover:border-blue-400
                  hover:bg-blue-500/20
                "
              >
                <Database size={14} />
                {table.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Columns */}

      {issue.columnRefs?.length ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Columns
          </p>

          <div className="flex flex-wrap gap-2">
            {issue.columnRefs.map((column) => (
              <button
                key={column.id}
                onClick={() => {
                  onClose();
                  onSelectColumn?.(column.tableId, column.id);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-violet-500/30
                  bg-violet-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-violet-300
                  transition
                  hover:border-violet-400
                  hover:bg-violet-500/20
                "
              >
                <Columns3 size={14} />
                {column.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
