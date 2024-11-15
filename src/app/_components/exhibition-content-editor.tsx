import React, { useState, useEffect, useRef } from 'react';
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { uploadImage } from '~/lib/utils/image-uploader';

interface ExhibitionContentEditorProps {
    initialContent: string;
    onChange: (updatedContent: string) => void;
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
    initialContent, onChange }) => {  
        const editorContainerRef = useRef(null);
        const editorRef = useRef(null);
        const [isLayoutReady, setIsLayoutReady] = useState(false);
        const [blocks, setBlocks] = useState<PartialBlock[]>();

        useEffect(() => {
            const getInitBlocks = async () => {
                const parsedBlocks = await editor.tryParseHTMLToBlocks(initialContent);
                editor.replaceBlocks(editor.document, parsedBlocks);
                setBlocks(parsedBlocks);
            };
            getInitBlocks();
            setIsLayoutReady(true);

            return () => setIsLayoutReady(false);
        }, []);

        const editor = useCreateBlockNote({
            initialBlocks: blocks
        });
    
        return (
        <div>
            <div className="main-container">
                <div className="editor-container" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>{isLayoutReady && (
                            <BlockNoteView 
                            editor={editor} 
                            theme={"light"}
                            sideMenu={true}
                            linkToolbar={true}
                            formattingToolbar={true}
                            filePanel={true}
                            // uploadFile={uploadImage}
                            onChange={async () => {
                                setBlocks(editor.document);
                                const blocks2html = await editor.blocksToFullHTML(blocks);
                                onChange(blocks2html);
                            }}/>
                            
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExhibitionContentEditor;