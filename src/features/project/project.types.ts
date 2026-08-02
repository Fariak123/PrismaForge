import type {
  Relationship,
  Table,
} from "../../entities/schema/schema.types";

export interface PrismaForgeProject {
  version: 1;

  name: string;

  tables: Table[];

  relationships: Relationship[];
}