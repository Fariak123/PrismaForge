import type { Table } from "../../entities/schema/schema.types";
import type { Relationship } from "../../entities/schema/schema.types";
import type { TableColumn } from "../../entities/table/table.types";


function generateColumn(
  column: TableColumn
): string {

  let line =
    `  ${column.name} ${column.type}`;

  if (column.nullable) {
    line += "?";
  }

  if (column.primaryKey) {
    line += " @id @default(autoincrement())";
  }

  if (
    column.unique &&
    !column.primaryKey
  ) {
    line += " @unique";
  }

  return line;
}


function findColumn(
  table: Table,
  columnId: string
) {
  return table.columns.find(
    (column) =>
      column.id === columnId
  );
}


function generateRelationField(
  table: Table,
  relationship: Relationship,
  tableMap: Map<string, Table>
): string {


  const isSource =
    relationship.sourceTableId === table.id;


  const otherTable =
    tableMap.get(
      isSource
        ? relationship.targetTableId
        : relationship.sourceTableId
    );


  if (!otherTable) {
    return "";
  }


  const otherName =
    otherTable.name;


  /*
    User -> Post

    User:
      posts Post[]

    Post:
      user User @relation(...)
  */


  if (
    relationship.type === "one-to-many"
  ) {

    if (isSource) {

      return (
        `  ${otherName.toLowerCase()}s ${otherName}[]\n`
      );

    }


    const fkColumn =
      findColumn(
        table,
        relationship.targetColumnId
      );


    if (!fkColumn) {
      return "";
    }


    return (
      `  ${otherName.toLowerCase()} ${otherName} ` +
      `@relation(fields: [${fkColumn.name}], references: [id])\n`
    );
  }


  if (
    relationship.type === "one-to-one"
  ) {


    const fkColumn =
      findColumn(
        table,
        relationship.targetColumnId
      );


    if (!fkColumn) {
      return "";
    }


    return (
      `  ${otherName.toLowerCase()} ${otherName}? ` +
      `@relation(fields: [${fkColumn.name}], references: [id])\n`
    );

  }


  return "";
}


function generateModel(
  table: Table,
  relationships: Relationship[],
  tableMap: Map<string, Table>
): string {


  let output =
    `model ${table.name} {\n`;


  for (const column of table.columns) {
    output +=
      generateColumn(column) +
      "\n";
  }


  for (const relationship of relationships) {

    if (
      relationship.sourceTableId === table.id ||
      relationship.targetTableId === table.id
    ) {

      output +=
        generateRelationField(
          table,
          relationship,
          tableMap
        );

    }
  }


  output += "}\n";


  return output;
}



export function generatePrisma(
  tables: Table[],
  relationships: Relationship[]
) {
  const tableMap = new Map(
    tables.map((table) => [table.id, table])
  );

  const models = tables
    .map((table) =>
      generateModel(
        table,
        relationships,
        tableMap
      )
    )
    .join("\n");

  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${models}`;
}