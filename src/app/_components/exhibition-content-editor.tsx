import React, { useState, useEffect, useRef } from "react";
import { BlockNoteView, Theme, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import {
  combineByGroup,
  filterSuggestionItems,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultStyleSpecs,
  insertOrUpdateBlock,
  locales,
} from "@blocknote/core";

import "@blocknote/core/fonts/inter.css";

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
  useComponentsContext,
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
import { RiText } from "react-icons/ri";
import { Font, FontSelectorModal } from "./Font";

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
  const [isFontModalOpen, setFontModalOpen] = useState(false);

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
    styleSpecs: {
      ...defaultStyleSpecs,
      font: Font,
    },
  });

  const SetFontStyleButton = () => {
    const Components = useComponentsContext()!;

    return (
      <Components.FormattingToolbar.Button
        label="Set Font"
        mainTooltip={"Set Font"}
        icon={<RiText />}
        onClick={() => {
          setFontModalOpen(true);
        }}
      />
    );
  };

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
        // white: { text: "#ffffff", background: "#ffffff" }, // Pure white
        // black: { text: "#000000", background: "#000000" }, // Pure black
        gray: { text: "#808080", background: "#d3d3d3" }, // Neutral gray tones
        brown: { text: "#654321", background: "#a0522d" }, // Rich brown tones
        red: { text: "#ff0000", background: "#ffcccc" }, // Vibrant red
        orange: { text: "#ff8c00", background: "#ffe5b4" }, // Bright orange
        yellow: { text: "#ffd700", background: "#fffacd" }, // Vibrant yellow
        green: { text: "#008000", background: "#98fb98" }, // Rich green
        blue: { text: "#0000ff", background: "#add8e6" }, // Bright blue
        purple: { text: "#800080", background: "#dda0dd" }, // Deep purple
        pink: { text: "#ff69b4", background: "#ffb6c1" }, // Vibrant pink
      },
    },
  };

  const editor = useCreateBlockNote({
    uploadFile: uploadFile,
    schema: withMultiColumn(schema), // TODO eslint acting up here :/
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

  const handleFontSelect = (fontName: string) => {
    setFontModalOpen(false);
    editor.addStyles({
      font: fontName,
    });
  };

  return (
    <div>
      <div className="main-container">
        {/* TODO move out into nice modal window */}
        <FontSelectorModal
          isOpen={isFontModalOpen}
          onClose={() => setFontModalOpen(false)}
          onSelectFont={handleFontSelect}
        />

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
                      <SetFontStyleButton />
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
