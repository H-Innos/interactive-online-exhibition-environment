import React from 'react';

interface EditorPreviewProps {
    content: string,
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ content }) => {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Editor Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    )
};

export default EditorPreview;