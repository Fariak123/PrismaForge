import type { Table } from "../../entities/schema/schema.types";
import type { Relationship } from "../../entities/schema/schema.types";

import type {
  ValidationIssue,
} from "./validation.types";


export function validateSchema(
  tables: Table[],
  relationships: Relationship[]
): ValidationIssue[] {

  const issues: ValidationIssue[] = [];


  /*
    Duplicate table names
  */

  const tableNames = new Map<string, Table[]>();


  for (const table of tables) {

    const existing =
      tableNames.get(table.name) ?? [];


    existing.push(table);

    tableNames.set(
      table.name,
      existing
    );
  }


  for (const [
    _name,
    duplicatedTables
  ] of tableNames) {


    if (duplicatedTables.length > 1) {

      duplicatedTables.forEach(table => {

        issues.push({
          id: crypto.randomUUID(),

          severity: "error",

          message:
            "Duplicate table name",

          tableId:
            table.id,

          tableRefs: [
            {
              id: table.id,
              name: table.name,
            },
          ],
        });

      });

    }

  }



  /*
    Primary key check
  */

  for (const table of tables) {

    const hasPrimaryKey =
      table.columns.some(
        column =>
          column.primaryKey
      );


    if (!hasPrimaryKey) {

      issues.push({

        id: crypto.randomUUID(),

        severity: "warning",

        message:
          "Table has no primary key",

        tableId:
          table.id,

        tableRefs: [
          {
            id: table.id,
            name: table.name,
          },
        ],

      });

    }

  }



  /*
    Duplicate columns
  */

  for (const table of tables) {


    const columns =
      new Map<string, typeof table.columns>();


    for (const column of table.columns) {


      const existing =
        columns.get(column.name)
        ?? [];


      existing.push(column);


      columns.set(
        column.name,
        existing
      );

    }



    for (const [
      _name,
      duplicatedColumns
    ] of columns) {


      if (
        duplicatedColumns.length > 1
      ) {

        issues.push({

          id:
            crypto.randomUUID(),

          severity:
            "error",

          message:
            "Duplicate column name",

          tableId:
            table.id,


          tableRefs: [
            {
              id: table.id,
              name: table.name,
            },
          ],


          columnRefs:
            duplicatedColumns.map(
              column => ({
                id: column.id,
                name: column.name,
                tableId: table.id,
              })
            ),

        });

      }

    }

  }



  /*
    Relationship validation
  */


  for (const relation of relationships) {


    const source =
      tables.find(
        table =>
          table.id ===
          relation.sourceTableId
      );


    const target =
      tables.find(
        table =>
          table.id ===
          relation.targetTableId
      );


    if (!source || !target) {

      issues.push({

        id:
          crypto.randomUUID(),

        severity:
          "error",

        message:
          "Relationship points to missing table",

        relationshipId:
          relation.id,

      });


      continue;
    }



    const sourceColumn =
      source.columns.find(
        column =>
          column.id ===
          relation.sourceColumnId
      );


    const targetColumn =
      target.columns.find(
        column =>
          column.id ===
          relation.targetColumnId
      );



    if (!sourceColumn) {

      issues.push({

        id:
          crypto.randomUUID(),

        severity:
          "error",

        message:
          "Relationship source column is missing",

        relationshipId:
          relation.id,


        tableRefs: [
          {
            id: source.id,
            name: source.name,
          },
        ],

      });

    }



    if (!targetColumn) {

      issues.push({

        id:
          crypto.randomUUID(),

        severity:
          "error",

        message:
          "Relationship target column is missing",


        relationshipId:
          relation.id,


        tableRefs: [
          {
            id: target.id,
            name: target.name,
          },
        ],

      });

    }



    if (
      sourceColumn &&
      targetColumn &&
      sourceColumn.type !== targetColumn.type
    ) {


      issues.push({

        id:
          crypto.randomUUID(),

        severity:
          "warning",


        message:
          "Relationship column types do not match",


        relationshipId:
          relation.id,


        tableRefs: [
          {
            id: source.id,
            name: source.name,
          },
          {
            id: target.id,
            name: target.name,
          },
        ],


        columnRefs: [
          {
            id: sourceColumn.id,
            name: sourceColumn.name,
            tableId: source.id,
          },
          {
            id: targetColumn.id,
            name: targetColumn.name,
            tableId: target.id,
          },
        ],

      });

    }

  }



  return issues;
}