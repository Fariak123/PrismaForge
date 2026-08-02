import { useCallback, useState } from "react";

import type {
  Table,
  Relationship,
} from "../../entities/schema/schema.types";

import type { ValidationIssue } from "./validation.types";

import { validateSchema } from "./schema.validator";

export function useValidation(
  tables: Table[],
  relationships: Relationship[]
) {
  const [issues, setIssues] =
    useState<ValidationIssue[]>([]);

  const [showIssues, setShowIssues] =
    useState(false);

  const [pendingAction, setPendingAction] =
    useState<(() => void) | null>(null);

  const validate = useCallback(
    (action: () => void) => {
      const result = validateSchema(
        tables,
        relationships
      );

      if (result.length > 0) {
        setIssues(result);
        setPendingAction(() => action);
        setShowIssues(true);
        return;
      }

      action();
    },
    [tables, relationships]
  );

  const continueAction = useCallback(() => {
    setShowIssues(false);

    pendingAction?.();

    setPendingAction(null);
  }, [pendingAction]);

  const closeIssues = useCallback(() => {
    setShowIssues(false);
    setPendingAction(null);
  }, []);

  return {
    issues,
    showIssues,

    validate,

    continueAction,
    closeIssues,
  };
}