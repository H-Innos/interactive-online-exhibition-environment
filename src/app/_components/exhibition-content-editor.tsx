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
import { RiFilePdfFill } from "react-icons/ri";
import { RiText } from "react-icons/ri";

import { PDF } from "~/app/_components/pdf-block";
import { Font, FontSelectorModal } from "~/app/_components/font-selector";

interface ExhibitionContentEditorProps {
  initialContent: string;
  onChange: (updatedContent: string) => void;
  bgColor: string;
}

type GroupType = "Heading" | "Media" | "Other";

interface SuggestionItem {
  group: GroupType;
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
  initialContent,
  onChange,
  bgColor,
}) => {
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

  const customBgTheme: Theme = {
    ...lightDefaultTheme,
    colors: {
      ...lightDefaultTheme.colors,
      editor: {
        text: "#3F3F3F",
        background: bgColor,
      },
      highlights: {
        gray: { text: "#F5F5F5", background: "#B8B8B8" }, // Neutral gray tones
        brown: { text: "#654321", background: "#a0522d" }, // Rich brown tones
        red: { text: "#ff0000", background: "#ff0000" }, // Vibrant red
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
    group: "Media",
    icon: <RiFilePdfFill />,
    subtext: "PDF file with interactive preview window",
  });

  const handleFontSelect = (fontName: string) => {
    setFontModalOpen(false);
    editor.addStyles({
      font: fontName,
    });
  };

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
  }, [editor, initialContent]);

  const reorderSuggestions = (
    defaultItems: ReturnType<typeof getDefaultReactSlashMenuItems>,
    additionalItems: ReturnType<typeof getMultiColumnSlashMenuItems>,
    customItems: SuggestionItem[],
  ) => {
    const groupedItems = [
      ...combineByGroup(defaultItems, additionalItems, customItems),
    ];

    return groupedItems.sort((a, b) => {
      const order: Record<GroupType, number> = {
        Heading: 1,
        Media: 2,
        Other: 3,
      };

      const aGroup = order[a.group as GroupType] ?? Number.MAX_SAFE_INTEGER;
      const bGroup = order[b.group as GroupType] ?? Number.MAX_SAFE_INTEGER;

      if (aGroup < bGroup) return -1;
      if (aGroup > bGroup) return 1;
      return 0;
    });
  };

  return (
    <div>
      <div className="main-container">
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
                      reorderSuggestions(
                        getDefaultReactSlashMenuItems(editor),
                        getMultiColumnSlashMenuItems(editor),
                        [
                          // @ts-expect-error: xl multi-column breaks previous typing, incompatible
                          insertPDF(editor),
                        ],
                      ),
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
