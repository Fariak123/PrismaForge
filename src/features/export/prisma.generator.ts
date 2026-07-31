import type { TableColumn } from "../../entities/table/table.types";
import type { Relationship } from "../../entities/schema/schema.types";
import type { Table } from "../../entities/schema/schema.types";

function generateColumn(column: TableColumn): string {
  let line = `  ${column.name} ${column.type}`;

  if (column.nullable) {
    line += "?";
  }

  if (column.primaryKey) {
    line += " @id @default(autoincrement())";
  }

  if (column.unique && !column.primaryKey) {
    line += " @unique";
  }

  return line;
}

function generateModel(
  table: Table,
  relationships: Relationship[],
  tables: Table[]
): string {
  let output = `model ${table.name} {\n`;

  for (const column of table.columns) {
    output += generateColumn(column) + "\n";
  }

  for (const relationship of relationships) {
    if (
      relationship.sourceTableId === table.id ||
      relationship.targetTableId === table.id
    ) {
      output += generateRelationField(
        table,
        relationship,
        tables
      );
    }
  }

  output += "}\n";

  return output;
}

function findColumn(
  table: Table,
  columnId: string,
) {
  return table.columns.find(
    (column) => column.id === columnId
  );
}

function generateRelationField(
  node: Table,
  relationship: Relationship,
  nodes: Table[]
): string {
  const sourceTable =
    nodes.find(
      (table) =>
        table.id === relationship.sourceTableId
    );
  const targetTable =
    nodes.find(
      (table) =>
        table.id === relationship.targetTableId
    );

  if (!sourceTable || !targetTable) {
    return "";
  }

  const sourceColumn =
    findColumn(
      sourceTable,
      relationship.sourceColumnId
    );
  const targetColumn =
    findColumn(
      targetTable,
      relationship.targetColumnId
    );

  if (!sourceColumn || !targetColumn) {
    return "";
  }
  // Parent side
  if (node.id === sourceTable.id) {
    if (
      relationship.type === "one-to-many"
    ) {
      return (
        `  ${targetTable.name.toLowerCase()}s ${targetTable.name}[]\n`
      );
    }
  }
  // Foreign key side
  if (node.id === targetTable.id) {
    if (
      relationship.type === "one-to-many"
    ) {
      return (
        `  ${sourceTable.name.toLowerCase()} ${sourceTable.name} @relation(fields: [${targetColumn.name}], references: [${sourceColumn.name}])\n`
      );
    }
  }
  return "";
}

export function generatePrisma(
  tables: Table[],
  relationships: Relationship[],
) {
  return tables
    .map((table) =>
      generateModel(
        table,
        relationships,
        tables
      )
    )
    .join("\n");
}