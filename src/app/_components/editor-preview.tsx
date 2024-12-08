import React from "react";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "~/styles/colors.css";

interface EditorPreviewProps {
  content: string;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ content }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Editor Preview:</h2>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="blocknote-content"
      />
    </div>
  );
};

export default EditorPreview;
