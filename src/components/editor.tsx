import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { UploaderPlugin } from '~/utils/plugins';
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';

interface ExhibitionEditorProps {
    initialContent: string,
    onChange: (event: EventInfo, editor: Editor) => void,
}

const editorDefaultConfig = {
    extraPlugins: [UploaderPlugin]
}

const ExhibitionEditor: React.FC<ExhibitionEditorProps> = ({ initialContent, onChange }) => {
    return (
        <CKEditor
        editor={ClassicEditor}
        data={initialContent}
        onChange={onChange}
        config={editorDefaultConfig}
      />
    );
};

export default ExhibitionEditor;