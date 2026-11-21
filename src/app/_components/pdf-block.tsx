import { FileBlockConfig } from "@blocknote/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import {
  AddFileButton,
  createReactBlockSpec,
  DefaultFilePreview,
  FileAndCaptionWrapper,
  ReactCustomBlockRenderProps,
} from "@blocknote/react";

import { RiFilePdfFill } from "react-icons/ri";

// Weird type issues here, kinda unsolvable ATM without disabling lines.
// Code lifted from official repo demo

export const PDFPreview = (
  props: Omit<
    ReactCustomBlockRenderProps<FileBlockConfig, any, any>, // eslint-disable-line
    "contentRef"
  >,
) => {
  return (
    <ResizableBox
      width={props.block.props.previewWidth as unknown as number}
      height={props.block.props.previewHeight ?? 600}
      minConstraints={[300, 300]}
      maxConstraints={[2500, 2500]}
      resizeHandles={["se", "e", "s"]}
      onResizeStop={(e, data) => {
        props.editor.updateBlock(props.block, {
          //previewWidth: data.size.width,
          //previewHeight: data.size.height,
        });
      }}
    >
      <embed
        type={"application/pdf"}
        src={props.block.props.url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        contentEditable={false}
        draggable={true}
        onClick={() => props.editor.setTextCursorPosition(props.block)}
      />
    </ResizableBox>
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
      previewHeight: {
        default: 600,
      },
    },
    content: "none",
    isFileBlock: true,
  },
  {
    render: (props) => (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {props.block.props.url === "" ? (
          <AddFileButton
            {...props}
            editor={props.editor as any} // eslint-disable-line
            buttonText={"Add PDF"}
            buttonIcon={<RiFilePdfFill size={24} />}
          />
        ) : !props.block.props.showPreview ? (
          <FileAndCaptionWrapper
            block={props.block}
            editor={props.editor as any} // eslint-disable-line
          >
            <DefaultFilePreview
              block={props.block}
              editor={props.editor as any} // eslint-disable-line
            />
          </FileAndCaptionWrapper>
        ) : (
          <FileAndCaptionWrapper
            block={props.block}
            editor={props.editor as any} // eslint-disable-line
          >
            <PDFPreview
              block={props.block}
              editor={props.editor as any} // eslint-disable-line
            />
          </FileAndCaptionWrapper>
        )}
      </div>
    ),
  },
);
