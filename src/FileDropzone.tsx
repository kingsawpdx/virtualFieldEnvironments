import Dropzone from "react-dropzone";

/* TODO: structure so that it can inherit mui themes 
    -  docs: https://mui.com/material-ui/customization/creating-themed-components/
    -  example: https://github.com/viclafouch/mui-file-input/tree/main */

interface FileDropzoneProps {
  onUploadVFE: (file: File) => void;
}

function FileDropzone({ onUploadVFE }: FileDropzoneProps) {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        onUploadVFE(acceptedFiles[0]);
      }}
      accept={{ "application/zip": [".zip"] }}
    >
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            style={{
              width: "80%",
              height: "300px",
              backgroundColor: "#F5F5F5",
              border: "dashed black",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              margin: "auto",
            }}
          >
            <input {...getInputProps()} />
            <p style={{ margin: "auto" }}>Drag 'n' drop a VFE zip or click</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default FileDropzone;
