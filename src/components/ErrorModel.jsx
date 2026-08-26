import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import "../pages/configure/global-constants/PredefineGlobalConstant.css";
import Backdrop from "@mui/material/Backdrop";
import errorImage from "../assets/images/gif/wired-outline-1140-error.gif";

const ErrorModel = (props) => {
  const [isClosing, setIsClosing] = useState(false);
  return (
    <>
      <Modal
        open={props.ErrorModel}
        onClose={props.handleClose}
        // disableEnforceFocus={false} // Disable enforce focus to disable animation
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        BackdropComponent={(props) => (
          <Backdrop onClick={isClosing ? null : props.onClose} />
        )}
        sx={{
          display: "flex",
          p: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: "500px" }}
          class="modal-dialog modal-dialog-centered"
        >
          <div class="modal-content">
            <div class="modal-header" style={{ paddingBottom: "10px" }}></div>
            <div class="modal-body">
              <div class="text-center">
                <div>
                  <img
                    src={errorImage}
                    alt="error_Img"
                    height="100px"
                    width="100px"
                  />
                </div>
                <div class="mt-2 fs-15 mx-4 mx-sm-5">
                  {props.errorMessageTitle ? (
                    <h4>{props.errorMessageTitle} </h4>
                  ) : null}
                  <p class="text-center mb-0" style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                    {props.ErrorMessage === ""
                      ? props?.emailError !== null ? props?.emailError :
                        "Something Went Wrong"
                      : props.ErrorMessage}
                  </p>
                </div>
              </div>
              <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                <p>
                  <div className="add-new-btn">
                    <Button
                      type="button"
                      class="btn btn-md btn-success create-item-btn"
                      onClick={() => {
                        props.handleClose();
                      }}
                    >
                      <span style={{ padding: "15px" }}>Ok</span>
                    </Button>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ErrorModel;
