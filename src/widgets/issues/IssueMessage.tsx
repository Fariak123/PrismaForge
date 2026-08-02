import type { ValidationIssue } from "../../features/validation/validation.types";


interface Props {
  issue: ValidationIssue;

  onClose: () => void;

  onSelectTable?: (
    tableId: string
  ) => void;

  onSelectColumn?: (
    tableId: string,
    columnId: string
  ) => void;
}


export default function IssueMessage({
  issue,
  onClose,
  onSelectTable,
  onSelectColumn,
}: Props) {


  return (
    <div className="space-y-3">

      {/* Message */}

      <p
        className="
          text-sm
          text-zinc-200
        "
      >
        {issue.message}
      </p>



      {/* Tables */}

      {issue.tableRefs &&
        issue.tableRefs.length > 0 && (

        <div className="flex flex-wrap gap-2">

          {issue.tableRefs.map((table) => (

            <button
              key={table.id}
              onClick={() => {
                onClose();
                onSelectTable?.(table.id);
              }}
              className="
                rounded-md
                border
                border-blue-500/30
                bg-blue-500/10
                px-2
                py-1
                text-xs
                text-blue-400
                transition
                hover:border-blue-400
                hover:bg-blue-500/20
              "
            >
              {table.name}
            </button>

          ))}

        </div>

      )}



      {/* Columns */}

      {issue.columnRefs &&
        issue.columnRefs.length > 0 && (

        <div className="flex flex-wrap gap-2">

          {issue.columnRefs.map((column) => (

            <button
              key={column.id}
              onClick={() => {
                onClose();
                onSelectColumn?.(
                  column.tableId,
                  column.id
                );
              }}
              className="
                rounded-md
                border
                border-purple-500/30
                bg-purple-500/10
                px-2
                py-1
                text-xs
                text-purple-400
                transition
                hover:border-purple-400
                hover:bg-purple-500/20
              "
            >
              {column.name}
            </button>

          ))}

        </div>

      )}

    </div>
  );
}