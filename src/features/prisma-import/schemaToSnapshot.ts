import type { SchemaSnapshot } from '../../entities/history/history.types';
import type { DataType } from '../../entities/table/table.types';
import type { ParsedPrismaSchema } from './prisma.parser';

export function prismaToSnapshot(
  schema: ParsedPrismaSchema,
): SchemaSnapshot {

  const tableMap = new Map<string, string>();

  const columnMap = new Map<
    string,
    string
  >();


  const tables = schema.models.map(
    (model, index) => {

      const tableId =
        crypto.randomUUID();


      tableMap.set(
        model.name,
        tableId,
      );


      const columns =
        model.fields.map((field) => {

          const columnId =
            crypto.randomUUID();


          columnMap.set(
            `${model.name}.${field.name}`,
            columnId,
          );


          return {
            id: columnId,

            name: field.name,

            type: 
              mapPrismaType(field.type),

            nullable:
              field.optional,

            primaryKey:
              field.isId,

            unique:
              field.isUnique || field.isId,
          };

        });


      return {
        id: tableId,
        name: model.name,
        position: {
          x: (index % 4) * 350,
          y:
            Math.floor(index / 4) *
            250,
        },
        columns,
      };

    },
  );
  const relationships =
    createRelationships(
      schema,
      tableMap,
      columnMap,
    );
  return {
    tables,
    relationships,
  };
}

function createRelationships(
  schema: ParsedPrismaSchema,
  tableMap: Map<string, string>,
  columnMap: Map<string, string>,
) {
  const relationships: any = [];

  for (const model of schema.models) {

    for (const relation of model.relations) {

      // Only handle list side
      // User.posts Post[]
      if (!relation.isList) {
        continue;
      }


      const targetModel =
        schema.models.find(
          m => m.name === relation.targetModel
        );


      if (!targetModel) continue;


      // Find FK side
      // Post.user -> User
      const fkRelation =
        targetModel.relations.find(
          r =>
            r.targetModel === model.name &&
            r.sourceFields.length > 0
        );

      if (!fkRelation) continue;

      const sourceTableId =
        tableMap.get(model.name);


      const targetTableId =
        tableMap.get(targetModel.name);


      const sourceColumnId =
        columnMap.get(
          `${model.name}.${fkRelation.targetFields[0]}`
        );

      const targetColumnId =
        columnMap.get(
          `${targetModel.name}.${fkRelation.sourceFields[0]}`
        );

      if (
        !sourceTableId ||
        !targetTableId ||
        !sourceColumnId ||
        !targetColumnId
      ) {
        continue;
      }

      relationships.push({
        id: crypto.randomUUID(),
        sourceTableId,
        targetTableId,
        sourceColumnId,
        targetColumnId,
        type: 'one-to-many',

      });

    }
  }
  return relationships;
}

function mapPrismaType(
 type:string,
): DataType {

 switch(type){

  case 'String':
    return 'String';

  case 'Int':
    return 'Int';

  case 'Boolean':
    return 'Boolean';

  case 'Float':
    return 'Float';

  case 'DateTime':
    return 'DateTime';

  default:
    return 'String';
 }
}