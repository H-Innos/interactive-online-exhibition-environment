import FileUploader from "./uploader";
import type { Editor } from "@ckeditor/ckeditor5-core";
import type { FileLoader } from "@ckeditor/ckeditor5-upload";

function UploaderPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
    return new FileUploader(loader);
  };
}

export { UploaderPlugin };