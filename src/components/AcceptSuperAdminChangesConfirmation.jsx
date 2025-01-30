/* global $ */
import React from "react";
function ConfirmSAChangesModel({
    UpdatedChanges,
    openErrorModal,
    modelRequestData,
    openSuccessModal,
    Status,
    ModelId
}) {
    return (
        <div
            style={{ display: (openSuccessModal || openErrorModal) && "none", zIndex: "99999", }}
            class="modal fade zoomIn designed-popup"
            id="ConfirmSAChangesModel"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style={{ paddingBottom: "10px" }}>
                        <h5 class="modal-title" id="exampleModalLabel">
                            {modelRequestData.Action === "Update" && Status
                                ? `Accept Changes` : `Decline Changes`}
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            id="btn-close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="  text-center">
                            <div class=" fs-15 mx-4 mx-sm-3">
                                <h4 class="text-dark">Are you sure?</h4>

                                {modelRequestData.Action === "Update" && Status && (
                                    <>
                                        <span class="text-muted mb-3">
                                            {/* Are you sure you want to Update this {modelRequestData.moduleName} ? */}
                                            Are you sure you want to accept these changes?
                                        </span>
                                    </>
                                )}
                                {modelRequestData.Action === "Update" && !Status && (
                                    <>
                                        <span class="text-muted mb-3">
                                            {/* Are you sure you want to Update this {modelRequestData.moduleName} ? */}
                                            Are you sure you want to decline these changes?
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                            <button
                                type="button"
                                class="btn btn-md btn-light cancel-item-btn"
                                onClick={() => {
                                    $("#" + ModelId).modal("show")
                                    $("#" + "ConfirmSAChangesModel").modal("hide")

                                }}
                            >
                                <span>Cancel</span>
                            </button>
                            {(
                                modelRequestData.Action === "Update") && (
                                    <button
                                    onClick={() => {
                                            UpdatedChanges();
                                        }}
                                        type="button"
                                        class="btn btn-md btn-success create-item-btn"
                                    >
                                    {(modelRequestData.Action === "Update") && (
                                                <span>Yes</span>
                                            )}
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmSAChangesModel;
