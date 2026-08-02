export type ValidationSeverity =
  | "error"
  | "warning";


export interface ValidationIssue {
  id: string;

  severity: "error" | "warning";

  message: string;

  tableId?: string;
  relationshipId?: string;

  tableRefs?: {
    id: string;
    name: string;
  }[];

  columnRefs?: {
    id: string;
    name: string;
    tableId: string;
  }[];
}