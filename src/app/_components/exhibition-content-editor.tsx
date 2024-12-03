import React, { useState, useEffect, useRef } from "react";
import { BlockNoteView, Theme, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import {
  combineByGroup,
  filterSuggestionItems,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  locales,
} from "@blocknote/core";

import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";

import {
  getMultiColumnSlashMenuItems,
  multiColumnDropCursor,
  locales as multiColumnLocales,
  withMultiColumn,
} from "@blocknote/xl-multi-column";

import { uploadFile } from "~/lib/utils/image-uploader";
import { PDF } from "./PDFBlock";

import { RiFilePdfFill } from "react-icons/ri";

interface ExhibitionContentEditorProps {
  initialContent: string;
  onChange: (updatedContent: string) => void;
  bgColor: string;
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
  initialContent,
  onChange,
  bgColor,
}) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    if (editor) {
      const getInitBlocks = async () => {
        const parsedBlocks = await editor.tryParseHTMLToBlocks(initialContent);
        editor.replaceBlocks(editor.document, parsedBlocks);
      };
      void getInitBlocks();
      setIsLayoutReady(true);
    }
    return () => setIsLayoutReady(false);
  }, []);

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      pdf: PDF,
    },
  });

  // TODO types and linter etc
  const customBgTheme: Theme = {
    ...lightDefaultTheme,
    colors: {
      ...lightDefaultTheme.colors,
      editor: {
        text: "#3F3F3F",
        background: bgColor,
      },
      highlights: {
        white: { text: "#ffffff", background: "#ffffff" },
        black: { text: "#000000", background: "#000000" },
        gray: { text: "#ff0000", background: "#3366ff" },
        brown: { text: "#ff0000", background: "#3366ff" },
        red: { text: "#ff0000", background: "#3366ff" },
        orange: { text: "#ff0000", background: "#3366ff" },
        yellow: { text: "#ff0000", background: "#3366ff" },
        green: { text: "#ff0000", background: "#3366ff" },
        blue: { text: "#ff0000", background: "#3366ff" },
        purple: { text: "#ff0000", background: "#3366ff" },
        pink: { text: "#ff0000", background: "#3366ff" },
      },
    },
  };

  const editor = useCreateBlockNote({
    uploadFile: uploadFile,
    schema: withMultiColumn(schema),
    dropCursor: multiColumnDropCursor,
    dictionary: {
      ...locales.en,
      multi_column: multiColumnLocales.en,
    },
  });

  const insertPDF = (editor: typeof schema.BlockNoteEditor) => ({
    title: "PDF",
    onItemClick: () => {
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
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {isLayoutReady && (
              <BlockNoteView
                editor={editor}
                theme={customBgTheme}
                sideMenu={true}
                linkToolbar={true}
                formattingToolbar={false}
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
                        ...combineByGroup(
                          getDefaultReactSlashMenuItems(editor),
                          getMultiColumnSlashMenuItems(editor),
                        ),
                        insertPDF(editor),
                      ],
                      query,
                    )
                  }
                />

                <FormattingToolbarController
                  formattingToolbar={() => (
                    <FormattingToolbar>
                      <BlockTypeSelect key={"blockTypeSelect"} />

                      <FileCaptionButton key={"fileCaptionButton"} />
                      <FileReplaceButton key={"replaceFileButton"} />

                      {/* TODO: Font selection button and custom dialog... */}

                      <BasicTextStyleButton
                        basicTextStyle={"bold"}
                        key={"boldStyleButton"}
                      />
                      <BasicTextStyleButton
                        basicTextStyle={"italic"}
                        key={"italicStyleButton"}
                      />
                      <BasicTextStyleButton
                        basicTextStyle={"underline"}
                        key={"underlineStyleButton"}
                      />
                      <BasicTextStyleButton
                        basicTextStyle={"strike"}
                        key={"strikeStyleButton"}
                      />
                      <BasicTextStyleButton
                        key={"codeStyleButton"}
                        basicTextStyle={"code"}
                      />

                      <TextAlignButton
                        textAlignment={"left"}
                        key={"textAlignLeftButton"}
                      />
                      <TextAlignButton
                        textAlignment={"center"}
                        key={"textAlignCenterButton"}
                      />
                      <TextAlignButton
                        textAlignment={"right"}
                        key={"textAlignRightButton"}
                      />

                      {/* TODO: re-create color style button with custom colors added in (ie white, black) */}
                      <ColorStyleButton key={"colorStyleButton"} />

                      <NestBlockButton key={"nestBlockButton"} />
                      <UnnestBlockButton key={"unnestBlockButton"} />

                      <CreateLinkButton key={"createLinkButton"} />
                    </FormattingToolbar>
                  )}
                />
              </BlockNoteView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionContentEditor;
