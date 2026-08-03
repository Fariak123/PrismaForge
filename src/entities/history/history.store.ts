import type { Relationship, Table } from "../schema/schema.types";

interface HistoryState {
  past: SchemaSnapshot[];
  future: SchemaSnapshot[];

  undo: () => void;
  redo: () => void;
  push: (snapshot: SchemaSnapshot) => void;
  clear: () => void;
}

type SchemaSnapshot = {
  tables: Table[];
  relationships: Relationship[];
};