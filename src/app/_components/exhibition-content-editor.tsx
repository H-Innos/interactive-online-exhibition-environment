import React, { useState, useEffect, useRef } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import {
  filterSuggestionItems,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
} from "@blocknote/core";

import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";

import { uploadFile } from "~/lib/utils/image-uploader";
import { PDF } from "./PDFBlock";

import { RiFilePdfFill } from "react-icons/ri";

interface ExhibitionContentEditorProps {
  initialContent: string;
  onChange: (updatedContent: string) => void;
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
  initialContent,
  onChange,
}) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    const getInitBlocks = async () => {
      const parsedBlocks = await editor.tryParseHTMLToBlocks(initialContent);
      editor.replaceBlocks(editor.document, parsedBlocks);
    };
    void getInitBlocks();
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      pdf: PDF,
    },
  });

  const editor = useCreateBlockNote({
    uploadFile: uploadFile,
    schema: schema,
  });

  const insertPDF = (editor: typeof schema.BlockNoteEditor) => ({
    title: "PDF",
    onItemClick: () => {
      // Block that the text cursor is currently in.
      insertOrUpdateBlock(editor, {
        type: "pdf",
      });
    },
    aliases: ["pdf"],
    group: "Other",
    icon: <RiFilePdfFill />,
    subtext: "PDF file with interactive preview window",
  });

  return (
    <div>
      <div className="main-container">
        <div className="editor-container" ref={editorContainerRef}>
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <BlockNoteView
                  editor={editor}
                  theme={"light"}
                  sideMenu={true}
                  linkToolbar={true}
                  formattingToolbar={true}
                  filePanel={true}
                  slashMenu={false}
                  onChange={async () => {
                    const blocks2html = await editor.blocksToFullHTML(
                      editor.document,
                    );
                    onChange(blocks2html);
                  }}
                >
                  <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query: string) =>
                      filterSuggestionItems(
                        [
                          ...getDefaultReactSlashMenuItems(editor),
                          insertPDF(editor),
                        ],
                        query,
                      )
                    }
                  />
                </BlockNoteView>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionContentEditor;
