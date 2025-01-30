/* global $ */
import React, { useEffect, useState, useRef, useContext } from "react";
import "./UploadImageStyle.css";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { AuthContextProvider } from "../../AuthContext/AuthContext";
import CancelIcon from "@mui/icons-material/Cancel";
import { ERROR_MESSAGES } from "../GlobalMessage";

function Upload_image_modal(props) {
  const { setTopbar } = useContext(AuthContextProvider);
  const ref1 = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); // Use a single image state
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
    const file = event.target.files[0]; // Assuming you only want to handle the first selected file
    // Check if the file type is allowed
    if (!allowedFileTypes.includes(file?.type) && file) {
      // Display an error message or handle it as needed
      setRequireInvalidErrorMessage(true);
      setRequireErrorMessage(false);
      event.target.value = "";
      return;
    }

    if (file && file?.size >= 2097152) {
      SetFileSizeError(true);
      setRequireErrorMessage(false);
      // Reset the value of the file input
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
      className={`modal ${props.class}`}
      id={props.id}
      tabIndex={props.tabIndex}
      aria-labelledby={props.aria_labelledby}
      aria-hidden={props.aria_hidden}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ width: "60%" }}>
          <div className="modal-header bg-light p-3">
            <h5 className="modal-title" id="exampleModalLabel">
              Upload signature
            </h5>
            <button
              type="button"
              className="btn-close"
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
          <div className="modal-body">
            <div>
              {selectedImage ? (
                <div className="upload-image-preview-div text-center">
                  <img
                    src={selectedImage}
                    style={{
                      height: "200px",
                      width: "200px",
                      objectFit: "contain",
                    }}
                    className="upload-image-preview"
                    alt="Selected Signature"
                  />
                </div>
              ) : (
                <>
                  <div className="Upload-signature" onClick={imageUpload}>
                    <CloudUploadOutlinedIcon className="cloud" />
                    <p>
                      <h5 style={{ cursor: "pointer" }}>Upload signature</h5>
                      <input
                        type="file"
                        accept="image/*"
                        className="img-display"
                        onChange={(e) => handleImageChange(e)}
                        ref={ref1}
                      />
                    </p>
                    {requireErrorMessage &&
                      (selectedImage === "" ||
                        selectedImage === null ||
                        selectedImage === undefined) ? (
                      <span className="validation">{ERROR_MESSAGES}</span>
                    ) : (
                      ""
                    )}
                    {requireInvalidErrorMessage || fileSizeError ? (
                      <span className="validation">
                        Supported file types are .jpg, .jpeg, .png up to a file
                        size of 2MB.
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <div className="gap-2 justify-content-end">
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
                className="btn btn-light Clear-Address"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className={
                  selectedImage === null
                    ? "btn btn-light disabled cursor-not-allowed Clear-Address"
                    : "btn btn-light Clear-Address"
                }
              >
                Remove Signature
              </button>
              <button
                type="submit"
                className="btn btn-md btn-primary create-item-btn"
                onClick={handleSubmit}
              >
                <span>Ok</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload_image_modal;
