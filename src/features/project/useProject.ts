import { useReactFlow } from '@xyflow/react';
import { useRef, useState } from 'react';
import { useSchemaStore } from '../../entities/schema/schema.store';
import { useValidation } from '../validation/useValidation';
import { downloadProject, openProject } from './project.service';
import type { ValidationIssue } from '../validation/validation.types';

export function useProject() {
  const [prismaViewerOpen, setPrismaViewerOpen] = useState(false);

  const prismaGenerateSchema = () => {
    const result = validate();

    if (!result.success) {
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
  const debugDialog = () => {
    showDialog({
      open: true,

      title: 'Debug Dialog',

      description: 'If you can see this, DialogModal is working correctly.',

      confirmText: 'OK',

      cancelText: 'Cancel',

      confirmVariant: 'primary',

      onConfirm: () => {
        console.log('Dialog confirmed');

        showDialog((d) => ({
          ...d,
          open: false,
        }));
      },
    });
  };

  const {
    tables,
    relationships,
    loadProject,
    clearSchema,
    isDirty,
    markSaved,
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

        inputRef.current?.click();
      },
    });
  };

  const saveProject = () => {
    const result = validate();

    if (!result.success) {
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
    downloadProject({
      version: 1,
      name: 'Database',
      tables,
      relationships,
    });
    markSaved();
    closeIssues();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const project = await openProject(file);
      loadProject(project.tables, project.relationships);

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
    prismaViewerOpen,

    setPrismaViewerOpen,

    prismaGenerateSchema,

    issues,

    issuesOpen,

    closeIssues,

    debugDialog,

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
