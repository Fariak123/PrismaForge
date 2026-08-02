import { useEffect, useState } from "react";
import { getHighlighter } from "./shiki";

interface Props {
  code: string;
}

export default function CodeViewer({
  code,
}: Props) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function highlight() {
      const highlighter =
        await getHighlighter();

      setHtml(
        highlighter.codeToHtml(code, {
          lang: "prisma",
          theme: "tokyo-night",
        })
      );
    }

    highlight();
  }, [code]);

  return (
    <div
      className="
        h-full
        overflow-auto
        text-sm
      "
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}