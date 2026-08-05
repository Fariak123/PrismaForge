export interface PrismaSchema {
  models: PrismaModel[];
}

export interface PrismaRelation {
  fieldName: string;

  targetModel: string;

  sourceFields: string[];

  targetFields: string[];

  isList: boolean;

  optional: boolean;
}

export interface PrismaModel {
  name: string;

  fields: PrismaField[];

  relations: PrismaRelation[];
}

export interface PrismaField {
  name: string;

  type: string;

  optional: boolean;

  isArray: boolean;

  isRelation: boolean;

  isId: boolean;

  isUnique: boolean;
}
