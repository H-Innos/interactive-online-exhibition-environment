import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
    AutoImage,
    Autoformat,
	Autosave,
	BlockQuote,
	Bold,
	CloudServices,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
    FontSize,
    FileRepository,
	Heading,
	Highlight,
	HorizontalLine,
	ImageBlock,
	ImageInline,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
    ImageToolbar,
    ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
    ListProperties,
    MediaEmbed,
	Paragraph,
	PasteFromOffice,
	SelectAll,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo,
    type Editor,
    type EventInfo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import { UploaderPlugin } from '~/lib/utils/plugins';

interface ExhibitionContentEditorProps {
    initialContent: string,
    onChange: (event: EventInfo<string, unknown>, editor: Editor) => void,
    saveData: (data: string) => Promise<void>
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
    initialContent, onChange }) => {  
        const editorContainerRef = useRef(null);
	    const editorRef = useRef(null);
	    const [isLayoutReady, setIsLayoutReady] = useState(false);

        useEffect(() => {
            setIsLayoutReady(true);

            return () => setIsLayoutReady(false);
        }, []);
    
        return (
        <div>
            <div className="main-container">
                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>{isLayoutReady && 
                    
                        <CKEditor
                            editor={ClassicEditor}
                            data={initialContent}
                            onChange={onChange}
                            config={{
                                extraPlugins: [UploaderPlugin],
                                toolbar: {
                                    items: [
                                        'undo',
                                        'redo',
                                        '|',
                                        'heading',
                                        '|',
                                        'fontSize',
                                        'fontFamily',
                                        'fontColor',
                                        'fontBackgroundColor',
                                        '|',
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strikethrough',
                                        '|',
                                        //'specialCharacters',
                                        //'horizontalLine',
                                        'link',
                                        'insertImage',
                                        'mediaEmbed',
                                        'insertTable',
                                        //'highlight',
                                        'blockQuote',
                                        '|',
                                        'alignment',
                                        '|',
                                        'bulletedList',
                                        'numberedList',
                                        'outdent',
                                        'indent'
                                    ],
                                    shouldNotGroupWhenFull: false
                                },
                                plugins: [
                                    AccessibilityHelp,
                                    Alignment,
                                    AutoImage,
                                    Autoformat,
                                    Autosave,
                                    BlockQuote,
                                    Bold,
                                    CloudServices,
                                    Essentials,
                                    FontBackgroundColor,
                                    FontColor,
                                    FontFamily,
                                    FileRepository,
                                    FontSize,
                                    Heading,
                                    Highlight,
                                    HorizontalLine,
                                    ImageBlock,
                                    ImageInline,
                                    ImageInsertViaUrl,
                                    ImageResize,
                                    ImageStyle,
                                    ImageToolbar,
                                    ImageUpload,
                                    Indent,
                                    IndentBlock,
                                    Italic,
                                    Link,
                                    List,
                                    ListProperties,
                                    MediaEmbed,
                                    Paragraph,
                                    PasteFromOffice,
                                    SelectAll,
                                    SpecialCharacters,
                                    SpecialCharactersArrows,
                                    SpecialCharactersCurrency,
                                    SpecialCharactersEssentials,
                                    SpecialCharactersLatin,
                                    SpecialCharactersMathematical,
                                    SpecialCharactersText,
                                    Strikethrough,
                                    Table,
                                    TableCaption,
                                    TableCellProperties,
                                    TableColumnResize,
                                    TableProperties,
                                    TableToolbar,
                                    Underline,
                                    Undo
                                ],
                                fontFamily: {
                                    supportAllValues: true
                                },
                                fontSize: {
                                    options: [10, 12, 14, 'default', 18, 20, 22],
                                    supportAllValues: true
                                },
                                heading: {
                                    options: [
                                        {
                                            model: 'paragraph',
                                            title: 'Paragraph',
                                            class: 'ck-heading_paragraph'
                                        },
                                        {
                                            model: 'heading1',
                                            view: 'h1',
                                            title: 'Heading 1',
                                            class: 'ck-heading_heading1'
                                        },
                                        {
                                            model: 'heading2',
                                            view: 'h2',
                                            title: 'Heading 2',
                                            class: 'ck-heading_heading2'
                                        },
                                        {
                                            model: 'heading3',
                                            view: 'h3',
                                            title: 'Heading 3',
                                            class: 'ck-heading_heading3'
                                        },
                                        {
                                            model: 'heading4',
                                            view: 'h4',
                                            title: 'Heading 4',
                                            class: 'ck-heading_heading4'
                                        }
                                    ]
                                },
                                image: {
                                    toolbar: ['imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage']
                                },
                                list: {
                                    properties: {
                                        styles: true,
                                        startIndex: true,
                                        reversed: true
                                    }
                                },
                                table: {
                                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                                },
                                /* delete if we have decided not to add autosaving back
                                autosave: {
                                    save (editor) {
                                        console.log('Saved changes:', editor.getData());
                                        return saveData(editor.getData());
                                    }
                                }
                                    */
                            }}
                        />
                        }</div>
                    </div>
                </div>
            </div>
        </div>
);
}

export default ExhibitionContentEditor;