import React from 'react';

import 'ckeditor5/ckeditor5.css';

interface EditorPreviewProps {
    content: string,
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ content }) => {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Editor Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} className="ck-content" />
        </div>
    )
};

export default EditorPreview;