import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';
import type { PrismaField, PrismaSchema } from './prisma.types';
import { getArrayArgument } from './prisma.helpers';

const SCALAR_TYPES = new Set([
  'String',
  'Int',
  'BigInt',
  'Float',
  'Decimal',
  'Boolean',
  'DateTime',
  'Bytes',
  'Json',
]);

function isRelationField(field: any) {
  const type = unwrapType(field.type).type;

  return !SCALAR_TYPES.has(type);
}

function extractRelation(field: any) {
  const type = unwrapType(field.type);

  if (SCALAR_TYPES.has(type.type)) {
    return null;
  }

  const relationAttribute = field.attributes.find(
    (attr: any) => attr.path.value[0] === 'relation',
  );

  return {
    fieldName: field.name.value,

    targetModel: type.type,

    sourceFields: relationAttribute
      ? getArrayArgument(relationAttribute.args, 'fields')
      : [],

    targetFields: relationAttribute
      ? getArrayArgument(relationAttribute.args, 'references')
      : [],

    isList: type.list,

    optional: type.optional,
  };
}

function unwrapType(type: any) {
  let optional = false;
  let list = false;

  while (type.kind !== 'typeId') {
    if (type.kind === 'optional') {
      optional = true;
    }

    if (type.kind === 'list') {
      list = true;
    }

    type = type.type;
  }

  return {
    type: type.name.value,
    optional,
    list,
  };
}

function extractField(field: any): PrismaField {
  const attrs = field.attributes ?? [];

  const type = unwrapType(field.type);

  const has = (name: string) =>
    attrs.some((a: any) => a.path.value[0] === name);

  return {
    name: field.name.value,

    type: type.type,

    optional: type.optional,

    isRelation: isRelationField(field),

    isArray: type.list,

    isId: has('id'),

    isUnique: has('unique') || has('id'),
  };
}

function extractModel(model: any) {
  const fields = model.members.filter((m: any) => m.kind === 'field');

  return {
    name: model.name.value,

    fields: fields
      .filter((field: any) => !isRelationField(field))
      .map(extractField),

    relations: fields.map(extractRelation).filter(Boolean),
  };
}

function extractSchema(ast: any): PrismaSchema {
  const models = ast.declarations
    .filter((d: any) => d.kind === 'model')
    .map(extractModel);

  return {
    models,
  };
}

export function parsePrisma(content: string) {
  const ast = parsePrismaSchema(content);
  return extractSchema(ast);
}

export type ParsedPrismaSchema = ReturnType<typeof parsePrisma>;
