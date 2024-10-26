import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { UploaderPlugin } from '~/utils/plugins';
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';

interface ExhibitionContentEditorProps {
    initialContent: string,
    onBlur: (event: EventInfo, editor: Editor) => void
}

const ExhibitionContentEditor: React.FC<ExhibitionContentEditorProps> = ({
    initialContent, onBlur }) => { 
    return (
        <CKEditor
        editor={ClassicEditor}
        data={initialContent}
        onBlur={onBlur}
        config={{
            extraPlugins: [UploaderPlugin]
            }
        }
      />
    );
};

export default ExhibitionContentEditor;