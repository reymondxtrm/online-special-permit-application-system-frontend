import React from 'react'
import Dropzone from "react-dropzone";
import { Row, Col, Card, UncontrolledAlert } from "reactstrap";
import { Link } from "react-router-dom";

const FileUpload = ({
  selectedFiles,
  uploadError,
  setselectedFiles,
  setUploadError,
  submitError,
  setSubmitError,
  label
}) => {
  function handleAcceptedFiles(files) {

    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
    setUploadError()
    submitError?setSubmitError(null):''
    
  }

  function handleErrorFiles(files) {
    setUploadError(files[0].errors[0])
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
  //***END */
  return (
    <>
      <Dropzone
        onDrop={
          acceptedFiles => {
            handleAcceptedFiles(acceptedFiles)
          }
        }
        onDropRejected={
          fileRejections => {
            handleErrorFiles(fileRejections)
          }
        }
        accept='image/*'
        maxSize={5242880}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone">
            <div
              className="dz-message needsclick mt-1"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="mb-2">
                <i className="display-4 text-muted bx bxs-cloud-upload" />
              </div>
              <h5>{label}</h5>
              <h5>Drop files here or click to upload.</h5>
              <h6>Maximum size of 5MB</h6>
            </div>
          </div>
        )}
      </Dropzone>
      <div className="dropzone-previews mt-3" id="file-previews">
        {selectedFiles.map((f, i) => {
          return (
            <Card
              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
              key={i + "-file"}
            >
              <div className="p-2">
                <Row className="align-items-center">
                  <Col className="col-auto">
                    <img
                      data-dz-thumbnail=""
                      height="80"
                      className="avatar-sm rounded bg-light"
                      alt={f.name}
                      src={f.preview}
                    />
                  </Col>
                  <Col>
                    <Link
                      to="#"
                      className="text-muted font-weight-bold"
                    >
                      {f.name}
                    </Link>
                    <p className="mb-0">
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Col>
                </Row>
              </div>
            </Card>
          )
        })}
      </div>
      {
        uploadError && (
          <div>
            <UncontrolledAlert
              color="danger"
              className="fade show"
              role="alert"
            >

              {
                uploadError.code === 'file-invalid-type' ? 'Upload Error, please upload an Image.' : uploadError.code === 'file-too-large' ? 'Upload Error, maximum file size is 5mb.' : uploadError.code === 'too-many-files' ? 'Upload Error, please upload only 1 file.' : 'Upload Error, please try again.'
              }
            </UncontrolledAlert>
          </div>
        )
      }
      {
        submitError && (
          <div>
            <UncontrolledAlert
              color="danger"
              className="fade show"
              role="alert"
            >

              {
                submitError
              }
            </UncontrolledAlert>
          </div>
        )
      }
    </>
  )
}

export default FileUpload