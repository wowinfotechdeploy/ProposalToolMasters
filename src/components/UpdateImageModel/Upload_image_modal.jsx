/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import "./UploadImageStyle.css";
import "./UploadImageStyle-redesign.css";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { ERROR_MESSAGES } from "../GlobalMessage";

function Upload_image_modal(props) {
  const { setTopbar } = useContext(AuthContextProvider);
  const ref1 = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [requireErrorMessage, setRequireErrorMessage] = useState(false);
  const [fileSizeError, SetFileSizeError] = useState(false);
  const [requireInvalidErrorMessage, setRequireInvalidErrorMessage] =
    useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    setTopbar("none");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage === null) {
      setRequireErrorMessage(true);
      SetFileSizeError(false);
      setRequireInvalidErrorMessage(false);
      return false;
    } else {
      props.handleImageUpload(image);
      setSelectedImage(null);
      $("#" + props.id).modal("hide");
    }
  };

  const imageUpload = () => {
    ref1.current.click();
  };

  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!allowedFileTypes.includes(file?.type) && file) {
      setRequireInvalidErrorMessage(true);
      setRequireErrorMessage(false);
      event.target.value = "";
      return;
    }

    if (file && file?.size >= 2097152) {
      SetFileSizeError(true);
      setRequireErrorMessage(false);
      event.target.value = "";
      return;
    }

    setRequireErrorMessage(false);
    setRequireInvalidErrorMessage(false);
    SetFileSizeError(false);
    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      const base64ImageData = reader.result;
      setSelectedImage(base64ImageData);

      props.setBasicInfo((prevBasicInfo) => ({
        ...prevBasicInfo,
        signatoryImage: file,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`modal ${props.class} upload-signature-modal-redesign`}
      id={props.id}
      tabIndex={props.tabIndex}
      aria-labelledby={props.aria_labelledby}
      aria-hidden={props.aria_hidden}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered upload-signature-dialog">
        <div className="modal-content upload-signature-content">
          <div className="modal-header upload-signature-header">
            <div className="upload-signature-heading">
              <span className="upload-signature-heading-icon">
                <i className="ri-quill-pen-line"></i>
              </span>
              <div>
                <h5 className="modal-title" id="exampleModalLabel">
                  Upload Signature
                </h5>
                <p>Add a clear signature image for authorized documents.</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-close upload-signature-close"
              onClick={() => {
                setRequireErrorMessage(false);
                SetFileSizeError(false);
                setRequireInvalidErrorMessage(false);
                setSelectedImage(null);
                props.setBasicInfo((prevBasicInfo) => ({
                  ...prevBasicInfo,
                  signatoryImage: null,
                }));
              }}
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close-modal"
            ></button>
          </div>

          <div className="modal-body upload-signature-body">
            {selectedImage ? (
              <div className="upload-signature-preview-section">
                <div className="upload-signature-preview-frame">
                  <img
                    src={selectedImage}
                    className="upload-image-preview upload-signature-preview-image"
                    alt="Selected Signature"
                  />
                </div>
                <div className="upload-signature-preview-copy">
                  <strong>Signature ready</strong>
                  <span>Review the image before confirming the upload.</span>
                </div>
              </div>
            ) : (
              <div
                className="Upload-signature upload-signature-dropzone"
                onClick={imageUpload}
              >
                <span className="upload-signature-cloud-wrap">
                  <CloudUploadOutlinedIcon className="cloud" />
                </span>

                <h5>Upload signature</h5>
                <p className="upload-signature-helper">
                  Click to select a JPG, JPEG or PNG image.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="img-display"
                  onChange={(e) => handleImageChange(e)}
                  ref={ref1}
                />

                <span className="upload-signature-file-rule">
                  Maximum file size: 2MB
                </span>

                {requireErrorMessage &&
                (selectedImage === "" ||
                  selectedImage === null ||
                  selectedImage === undefined) ? (
                  <span className="validation upload-signature-validation">
                    {ERROR_MESSAGES}
                  </span>
                ) : (
                  ""
                )}

                {requireInvalidErrorMessage || fileSizeError ? (
                  <span className="validation upload-signature-validation">
                    Supported file types are .jpg, .jpeg, .png up to a file size
                    of 2MB.
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>

          <div className="modal-footer upload-signature-footer">
            <button
              type="button"
              onClick={() => {
                setRequireErrorMessage(false);
                SetFileSizeError(false);
                setRequireInvalidErrorMessage(false);
                setSelectedImage(null);
                props.setBasicInfo((prevBasicInfo) => ({
                  ...prevBasicInfo,
                  signatoryImage: null,
                }));
              }}
              className="btn btn-light Clear-Address upload-signature-cancel-btn"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className={
                selectedImage === null
                  ? "btn btn-light disabled cursor-not-allowed Clear-Address upload-signature-remove-btn"
                  : "btn btn-light Clear-Address upload-signature-remove-btn"
              }
            >
              Remove Signature
            </button>

            <button
              type="submit"
              className="btn btn-md btn-primary create-item-btn upload-signature-confirm-btn"
              onClick={handleSubmit}
            >
              <i className="ri-check-line"></i>
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload_image_modal;
