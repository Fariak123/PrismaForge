import type { Edge } from "@xyflow/react";
import type { TableNode } from "../canvas/editor.store";

export function generatePrisma( nodes: TableNode[], edges: Edge[] ) {
  let output = "";

  for (const node of nodes) {
    output += `model ${node.data.name} {\n`;

    for (const column of node.data.columns) {
      output += `  ${column.name} ${column.type}`;

      if (column.primaryKey) {
        output += " @id @default(autoincrement())";
      }

      if (column.unique && !column.primaryKey) {
        output += " @unique";
      }

      if (column.nullable) {
        output += "?";
      }

      output += "\n";
    }

    output += "}\n\n";
  }

  return output;
}