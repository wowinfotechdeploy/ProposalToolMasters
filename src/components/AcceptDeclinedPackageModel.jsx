import React from "react";;
function AcceptDeclinedPackage({ Message, handleAcceptFunction, handleDeclinedFunction }) {
    return (
        <div
            class="modal fade zoomIn designed-popup"
            id="AcceptDeclinedPackage"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style={{ paddingBottom: "10px" }}>
                        <h5 class="modal-title" id="exampleModalLabel">
                            Accept or Decline Package
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            // onClick={() => handleClose()}
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            id="btn-close"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <div class="  text-center">
                            <div class=" fs-15 mx-4 mx-sm-3">
                                <h4 class="text-dark">Are you sure?</h4>
                                {Message}
                            </div>
                        </div>
                        <div class="d-flex gap-2 justify-content-center mt-4 mb-2">

                            <button
                                type="submit"
                                class="btn btn-md btn-success accept-item-btn"
                                onClick={handleAcceptFunction}
                            >
                                <span>
                                    Accept
                                </span>
                            </button>
                            <button
                                type="submit"
                                class="btn btn-md btn-success declined-item-btn"
                                onClick={handleDeclinedFunction}
                            >
                                <span>
                                    Decline
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcceptDeclinedPackage;
