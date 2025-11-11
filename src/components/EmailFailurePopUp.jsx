import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import "../pages/configure/global-constants/PredefineGlobalConstant.css";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const EmailFailurePopUP = (props) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const common = useSelector((state) => state.Storage);
  return (
    <>
      <Modal
        open={props.open}
        // onClose={props.handleClose}
        // disableEnforceFocus={false} // Disable enforce focus to disable animation
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        onClose={(e, reason) => {
          // Prevent closing when clicking outside (backdrop)
          if (reason === "backdropClick") return;
          props.handleClose(); // Close only when explicitly triggered (like by clicking the button)
        }}
        BackdropComponent={props?.isBackDropDisplay ? Backdrop : ""}
        sx={{
          display: "flex",
          p: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ width: "500px" }}
          class="modal-dialog modal-md modal-dialog-centered"
        >
          <div class="modal-content">
            <div class="modal-header" style={{ paddingBottom: "10px" }}></div>
            <div class="modal-body">
              <div class="mt-2 text-center">
                <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                  {props.emailCheckModel.MethodName === "All Email Failed"
                    ? "Currently all our email services are down, please try after some time"
                    : `Current configured email service is down, would you like to send the ${
                        props.emailCheckModel.ModuleName === "EL"
                          ? "Engagement Letter"
                          : "Proposal"
                      } using default outbooks email account?`}
                </div>
              </div>
              <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                <div
                  className="add-new-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {props.emailCheckModel.MethodName !== "All Email Failed" && (
                    <Button
                      type="button"
                      class="btn btn-md btn-success create-item-btn"
                      onClick={props.onYesClick}
                    >
                      <span style={{ padding: "15px" }}>Yes</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    class="btn btn-md btn-success create-item-btn"
                    onClick={() => {
                      props.handleClose();
                    }}
                  >
                    <span style={{ padding: "15px" }}>
                      {props.emailCheckModel.MethodName !== "All Email Failed"
                        ? "No"
                        : "Okay"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmailFailurePopUP;
