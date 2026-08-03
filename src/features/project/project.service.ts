import type { PrismaForgeProject } from './project.types';

export async function openProject(file: File): Promise<PrismaForgeProject> {
  const text = await file.text();

  const project = JSON.parse(text);

  if (project.version !== 1) {
    throw new Error('Unsupported project version.');
  }
  return project;
}

export function downloadProject(project: PrismaForgeProject) {
  const json = JSON.stringify(project, null, 2);

  const blob = new Blob([json], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = `${project.name}.prismaforge`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
