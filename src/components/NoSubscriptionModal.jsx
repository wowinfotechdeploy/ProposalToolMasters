import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import "../pages/configure/global-constants/PredefineGlobalConstant.css";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NoSubscriptionModal = (props) => {
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
                {/* <div className="modallogo">
                  <div className="modallogo1"></div>
                  <span className="modallogo2"></span>
                  <span className="modallogo3"></span>
                  <div className="modallogo4"></div>
                  <div className="modallogo5"></div>
                  <div className="modallogo6"></div>
                </div> */}
                <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                  <p class="text-muted  mb-0 " style={{ overflow: "auto" }}>
                    You don't have required subscription to access this feature,
                    please purchase to proceed.
                  </p>
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
                  <Button
                    type="button"
                    class="btn btn-md btn-success create-item-btn"
                    onClick={() => {
                      props.upgradeBtn();
                      // props.setOpenSuccessModal(false)
                    }}
                  >
                    <span style={{ padding: "15px" }}>Upgrade</span>
                  </Button>
                  <Button
                    type="button"
                    class="btn btn-md btn-success create-item-btn"
                    onClick={() => {
                      props.handleClose();
                      // props.setOpenSuccessModal(false)
                    }}
                  >
                    <span style={{ padding: "15px" }}>Close</span>
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

export default NoSubscriptionModal;
