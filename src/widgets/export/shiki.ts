import { createHighlighter } from "shiki";

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export async function getHighlighter() {
  if (highlighter) {
    return highlighter;
  }

  highlighter = await createHighlighter({
    themes: ["tokyo-night"],
    langs: ["prisma"],
  });

  return highlighter;
}