import { 
    FileBlockConfig, 
    BlockNoteEditor,
    InlineContentSchema,
    StyleSchema
} from "@blocknote/core";

import {
  AddFileButton,
  createReactBlockSpec,
  DefaultFilePreview,
  FileAndCaptionWrapper,
  ReactCustomBlockRenderProps,
} from "@blocknote/react";

import { RiFilePdfFill } from "react-icons/ri";

export const PDFPreview = (
    props: Omit<
      ReactCustomBlockRenderProps<FileBlockConfig, InlineContentSchema, StyleSchema>,
      "contentRef"
    >
  ) => {
    return (
      <embed
        type={"application/pdf"}
        src={props.block.props.url}
        contentEditable={false}
        draggable={true}
        onClick={() => props.editor.setTextCursorPosition(props.block)}
      />
    );
  };
  
  export const PDF = createReactBlockSpec(
    {
      type: "pdf",
      propSchema: {
        name: {
          default: "" as const,
        },
        url: {
          default: "" as const,
        },
        caption: {
          default: "" as const,
        },
        showPreview: {
          default: true,
        },
        previewWidth: {
          default: 512,
        },
      },
      content: "none",
      isFileBlock: true,
    },
    {
      render: (props) => (
        <div className={"bn-file-block-content-wrapper"}>
          {props.block.props.url === "" ? (
            <AddFileButton
              {...props}
              editor={props.editor as BlockNoteEditor}
              buttonText={"Add PDF"}
              buttonIcon={<RiFilePdfFill size={24} />}
            />
          ) : !props.block.props.showPreview ? (
            <FileAndCaptionWrapper
              block={props.block}
              editor={props.editor as BlockNoteEditor}>
              <DefaultFilePreview
                block={props.block}
                editor={props.editor as BlockNoteEditor}
              />
            </FileAndCaptionWrapper>
          ) : (
            <FileAndCaptionWrapper
              block={props.block}
              editor={props.editor as BlockNoteEditor}>
              <PDFPreview block={props.block} editor={props.editor as BlockNoteEditor} />
            </FileAndCaptionWrapper>
          )}
        </div>
      ),
    }
  );