import FileUploader from "./uploader";

async function UploaderPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
    return new FileUploader(loader);
  };
}

export { UploaderPlugin };