/* global $ */
import React from "react";
import editGif from "../assets/images/gif/edit.gif";

function ConfirmModel({
  UpdatedStatus,
  openErrorModal,
  modelRequestData,
  openSuccessModal,
  modelAction,
}) {

  return (
    <div
      style={{ display: (openSuccessModal || openErrorModal) && "none" }}
      class="modal fade zoomIn designed-popup"
      id="ConfirmModel"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" style={{ paddingBottom: "10px", borderTop: "1px solid #d3d6d8", borderLeft: "1px solid #d3d6d8", borderRight: "1px solid #d3d6d8" }}>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              // onClick={() => modelRequestData.Action === "PaymentStatus" ? handleClose() : null}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              id="btn-close"
            ></button>
          </div>
          <div className={`custom-style modal-body ${modelRequestData.Action === "PaymentStatus" ? "payment-status" : ""}`}>
            <div class="  text-center">
              {(modelRequestData.Action === "Status" || modelRequestData.Action === "EnableApiIntegration") && (
                <img
                  src={editGif}
                  trigger="loop"
                  colors="primary:#f7b84b,secondary:#f06548"
                  style={{ width: "85px", height: "50px" }}
                />
              )}
              {modelRequestData.Action === "Delete" && (
                <lord-icon
                  src="https://cdn.lordicon.com/gsqxdxog.json"
                  trigger="loop"
                  colors="primary:#f7b84b,secondary:#f06548"
                  style={{ width: "75px", height: "60px" }}
                ></lord-icon>
              )}
              {modelRequestData.Action === "ResetEmailConfigurationChange" && (
                <lord-icon
                  src="https://cdn.lordicon.com/gsqxdxog.json"
                  trigger="loop"
                  colors="primary:#f7b84b,secondary:#f06548"
                  style={{ width: "75px", height: "60px" }}
                ></lord-icon>
              )}
              {modelRequestData.Action === "ClearCcBcc" && (
                <lord-icon
                  src="https://cdn.lordicon.com/gsqxdxog.json"
                  trigger="loop"
                  colors="primary:#f7b84b,secondary:#f06548"
                  style={{ width: "75px", height: "60px" }}
                ></lord-icon>
              )}

              {modelRequestData.Action === "Copy" && (
                <lord-icon
                  src="https://cdn.lordicon.com/uecgmesg.json"
                  trigger="loop"
                  colors="primary:#30c9e8,secondary:#08a88a"
                  style={{ width: "75px", height: "60px" }}
                ></lord-icon>
              )}

              <div class=" fs-15 mx-4 mx-sm-3">
                <h4 class="text-dark">Are you sure?</h4>
                {(modelRequestData.Action === "ReminderStatus" || modelRequestData.Action === "EnableApiIntegration") &&
                  (modelRequestData?.StatusType === null ||
                    modelRequestData?.StatusType === "" ||
                    modelRequestData?.StatusType === undefined) && (
                    <span class="text-muted mb-0">
                      Are you sure you want to change status to{" "}
                      {modelRequestData.status === "Enable"
                        ? "Disable"
                        : "Enable"}
                      ?
                    </span>
                  )}
                {modelRequestData.Action === "PaymentStatus" && (
                  <p class="text-muted mb-0">
                    Are you sure you want to set this payment gateway as default payment gateway ?
                  </p>
                )}
                {modelRequestData.Action === "Status" &&
                  (modelRequestData?.StatusType === null ||
                    modelRequestData?.StatusType === "" ||
                    modelRequestData?.StatusType === undefined) && (
                    <span class="text-muted mb-0">
                      Are you sure you want to change status to{" "}
                      {modelRequestData.status === "Active"
                        ? "InActive"
                        : "Active"}
                      ?
                    </span>
                  )}
                {modelRequestData.Action === "Resend" &&
                  (modelRequestData?.StatusType === null ||
                    modelRequestData?.StatusType === "" ||
                    modelRequestData?.StatusType === undefined) && (
                    <span class="text-muted mb-0">
                      {modelRequestData.message}
                    </span>
                  )}
                {(modelRequestData.Action === "UnpaidUser" || modelRequestData.Action === "PaidUser") &&
                  (modelRequestData?.StatusType === null ||
                    modelRequestData?.StatusType === "" ||
                    modelRequestData?.StatusType === undefined) && (
                    <span class="text-muted mb-0">
                      Are you sure you want to change status to{" "}
                      {modelRequestData.status === "Active"
                        ? "InActive"
                        : "Active"}
                      ?
                    </span>
                  )}
                {modelRequestData.Action === "Delete" && (
                  <span class="text-muted mb-0">
                    Are you sure you want to delete this record?
                  </span>
                )}
                {modelRequestData.Action ===
                  "ResetEmailConfigurationChange" && (
                    <span class="text-muted mb-0">
                      Are you sure you want to reset email configuration?
                    </span>
                  )}
                {modelRequestData.Action ===
                  "ResetPaymentGatewayChange" && (
                    <span class="text-muted mb-0">
                      {`Are you sure you want to reset ${modelRequestData.moduleName}?`}
                    </span>
                  )}
                {modelRequestData.Action === "ClearCcBcc" && (
                  <span class="text-muted mb-0">
                    Are you sure you want to reset CC/BCC configuration?
                  </span>
                )}
                {modelRequestData.Action === "Copy" && (
                  <span class="text-muted mb-0">
                    Are you sure you want to copy this record?
                  </span>
                )}
                {modelRequestData.Action === "Upload" && (
                  <>
                    <span class="text-muted mb-3">
                      Are you sure you want to upload this file?
                    </span>
                  </>
                )}

                {modelRequestData.StatusType === "IsDefault" &&
                  modelRequestData.Action === "Status" && (
                    <p class="text-muted mb-0">
                      Are you sure you want to{" "}
                      {modelRequestData.isDefault
                        ? "set this template as default template"
                        : "remove this template from default"}
                      ?
                    </p>
                  )}
                {modelRequestData.StatusType === "2FaIsDefault" &&
                  modelRequestData.Action === "Status" && (
                    <p class="text-muted mb-0">
                      Are you sure you want to{" "}
                      {modelRequestData.isDefault
                        ? "set this verification as the default verification?"
                        : "remove this verification from default ?"}
                    </p>
                  )}
                {modelRequestData.StatusType === "2FaStatusChange" && (
                  <p class="text-muted mb-0">
                    Are you sure you want to {modelRequestData.status} 2 Step
                    Verification?
                  </p>
                )}
                {modelRequestData.Action === "ELStatusChange" && (
                  <p class="text-muted mb-0">
                    Are you sure you want to {modelRequestData.status} EL?
                  </p>
                )}
                {modelRequestData.Action === "emailStatusChange" && (
                  <p class="text-muted mb-0">
                    Are you sure you want to {modelRequestData.status} mail box?
                  </p>
                )}
                {modelRequestData.Action === "Warning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <ul class="designed-list">
                        {modelRequestData.DriverName?.map((item) => (
                          <li key={item}>
                            {" "}
                            <span> {item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span class="font-weight-bold  mb-0">
                      Do you still want to{" "}
                      {modelAction == "Update" ? "update" : modelAction} the
                      service ?.
                    </span>
                  </>
                )}
                {modelRequestData.Action === "ServiceWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <ul class="designed-list">
                        {modelRequestData.ServiceName?.map((item) => (
                          <li key={item}>
                            {" "}
                            <span> {item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {modelRequestData.Action === "PracticeWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                  </>
                )}
                {modelRequestData.Action === "PracticeWarning" && (
                  <>
                    <div style={{ fontWeight: "900" }}>
                      <span class="text-muted mb-0">
                        Still do you want to{" "}
                        {modelAction == "Update" ? "update" : modelAction} a
                        practice?
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn btn-md btn-light cancel-item-btn"
                data-bs-dismiss="modal"
              // onClick={() => modelRequestData.Action === "PaymentStatus" ? handleClose() : null}
              >
                {modelRequestData.Action === "Warning" ||
                  modelRequestData.Action === "PracticeWarning" ||
                  modelRequestData.Action === "Upload" ||
                  modelRequestData.Action === "PaymentStatus" ? (
                  <span>No</span>
                ) : (
                  <span>Cancel</span>
                )}
              </button>
              {(modelRequestData.Action === "UnpaidUser" ||
                modelRequestData.Action === "Resend" ||
                modelRequestData.Action === "PaidUser" ||
                modelRequestData.Action === "Warning" ||
                modelRequestData.Action === "Status" ||
                modelRequestData.Action === "EnableApiIntegration" ||
                modelRequestData.Action === "ReminderStatus" ||
                modelRequestData.Action === "PaymentStatus" ||
                modelRequestData.Action === "Delete" ||
                modelRequestData.Action == "PracticeWarning" ||
                modelRequestData.Action === "2FaStatusChange" ||
                modelRequestData.Action === "ELStatusChange" ||
                modelRequestData.Action === "ResetEmailConfigurationChange" ||
                modelRequestData.Action === "Upload" ||
                modelRequestData.Action === "ClearCcBcc" ||
                modelRequestData.Action === "Copy" ||
                modelRequestData.Action === "emailStatusChange" ||
                modelRequestData.Action === "ResetPaymentGatewayChange"
              ) && (
                  <button
                    onClick={() => {
                      UpdatedStatus();
                    }}
                    type="button"
                    class="btn btn-md btn-success create-item-btn"
                  >
                    {(modelRequestData.Action === "Status" ||
                      modelRequestData.Action === "UnpaidUser" ||
                      modelRequestData.Action === "EnableApiIntegration" ||

                      modelRequestData.Action === "ReminderStatus" ||
                      modelRequestData.Action === "PaidUser" ||
                      modelRequestData.Action === "2FaStatusChange" ||
                      modelRequestData.Action === "ELStatusChange" ||
                      modelRequestData.Action === "emailStatusChange") && (
                        <span>Yes, Change It!</span>
                      )}

                    {modelRequestData.Action === "Delete" && (
                      <span>Yes, Delete It!</span>
                    )}
                    {(modelRequestData.Action ===
                      "ResetEmailConfigurationChange" ||
                      modelRequestData.Action === "ResetPaymentGatewayChange") && (
                        <span>Yes, Reset It!</span>
                      )}
                    {modelRequestData.Action === "ClearCcBcc" && (
                      <span>Yes, Reset It!</span>
                    )}
                    {modelRequestData.Action === "Resend" && (
                      <span>Yes, Re-send It!</span>
                    )}
                    {modelRequestData.Action === "Warning" && <span>Yes</span>}
                    {modelRequestData.Action === "Copy" && <span>Yes! Copy</span>}
                    {(modelRequestData.Action == "PracticeWarning" ||
                      modelRequestData.Action === "Upload" || modelRequestData.Action === "PaymentStatus") && <span>Yes</span>}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModel;
