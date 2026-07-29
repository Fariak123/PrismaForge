import type { Node } from "@xyflow/react";
import type { TableNodeData } from "../../entities/table/table.types";
import type { Table } from "../../entities/schema";

export function tablesToNodes(
  tables: Table[]
): Node<TableNodeData>[] {
  return tables.map((table) => ({
    id: table.id,
    type: "table",
    position: table.position,

    data: {
      name: table.name,
      columns: table.columns,
    },
  }));
}