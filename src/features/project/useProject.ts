import { useReactFlow } from '@xyflow/react';
import { useRef, useState } from 'react';
import { useSchemaStore } from '../../entities/schema/schema.store';
import { useValidation } from '../validation/useValidation';
import { downloadProject, openProject } from './project.service';
import type { ValidationIssue } from '../validation/validation.types';
import { parsePrisma } from '../prisma-import/prisma.parser';
import { prismaToSnapshot } from '../prisma-import/schemaToSnapshot';

type PendingAction =
  | 'save-project'
  | 'generate-prisma'
  | null;

export function useProject() {
  
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const loadDemo = async () => {
    const response =
      await fetch("/demo.prismaforge");

    const project =
      await response.json();

    replaceSnapshot(project);

  };

  const [prismaViewerOpen, setPrismaViewerOpen] = useState(false);

  const prismaGenerateSchema = () => {
    const result = validate();

    if (!result.success) {
      setPendingAction('generate-prisma');
      setIssues(result.issues);
      setIssuesOpen(true);
      return;
    }

    setPrismaViewerOpen(true);
  };

  const [issuesOpen, setIssuesOpen] = useState(false);

  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const closeIssues = () => {
    setIssuesOpen(false);
  };

  const closeDialog = () => {
    showDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const {
    tables,
    relationships,
    loadProject,
    clearSchema,
    isDirty,
    markSaved,
    replaceSnapshot
  } = useSchemaStore();

  const { validate } = useValidation(tables, relationships);

  const reactFlow = useReactFlow();

  const inputRef = useRef<HTMLInputElement>(null);

  const [dialog, showDialog] = useState({
    open: false,
    title: '',
    description: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    confirmVariant: 'primary',
    onConfirm: () => {},
  });

  const pickProject = () => {
    if (!isDirty) {
      inputRef.current?.click();
      return;
    }

    showDialog({
      open: true,

      title: 'Unsaved Changes',

      description:
        'Opening another project will discard your current unsaved changes.',

      confirmText: 'Open Anyway',

      cancelText: 'Cancel',

      confirmVariant: 'danger',

      onConfirm: () => {
        closeDialog();

        clearSchema();
      },
    });
  };

  const saveProject = () => {
    const result = validate();

    if (!result.success) {
      setPendingAction('save-project');
      setIssues(result.issues);
      setIssuesOpen(true);
      return;
    }

    downloadProject({
      version: 1,
      name: 'Database',
      tables,
      relationships,
    });
    markSaved();
  };

  const forceSave = () => {
    switch (pendingAction) {
      case 'save-project':
        downloadProject({
          version: 1,
          name: 'Database',
          tables,
          relationships,
        });
        break;

      case 'generate-prisma':
        setPrismaViewerOpen(true);
          break;
    }

    setPendingAction(null);
    markSaved();
    closeIssues();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const text = await file.text();
    try {
      switch(extension) {
        case 'prismaforge':
          const project = await openProject(file);
          loadProject(project.tables, project.relationships);
          break;
        case 'prisma':
          const prisma = parsePrisma(text);
          const snapshot = prismaToSnapshot(prisma);
          replaceSnapshot(snapshot);
          break
      }

      requestAnimationFrame(() => {
            reactFlow.fitView({
              duration: 500,
              padding: 0.2,
            });
          });
    } catch {
      showDialog({
        open: true,
        title: 'Invalid Project',
        description: 'The selected file is not a valid PrismaForge project.',
        confirmText: 'OK',
        cancelText: '',
        confirmVariant: 'primary',

        onConfirm: () => {
          showDialog((d) => ({
            ...d,
            open: false,
          }));
        },
      });
    }
    e.target.value = '';
  };

  const newProject = () => {
    if (!isDirty) {
      clearSchema();

      return;
    }

    showDialog({
      open: true,

      title: 'Unsaved Changes',

      description: 'Creating a new project will discard all unsaved changes.',

      confirmText: 'Continue',

      cancelText: 'Cancel',

      confirmVariant: 'danger',

      onConfirm: () => {
        clearSchema();

        markSaved();

        reactFlow.fitView();

        closeDialog();
      },
    });
  };

  return {
    setPendingAction,

    loadDemo,

    prismaViewerOpen,

    setPrismaViewerOpen,

    prismaGenerateSchema,

    issues,

    issuesOpen,

    closeIssues,

    inputRef,

    pickProject,

    handleFileSelected,

    saveProject,

    forceSave,

    newProject,

    dialog,

    closeDialog() {
      showDialog((d) => ({
        ...d,
        open: false,
      }));
    },
  };
}
