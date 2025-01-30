import React from "react";

const LogoutModal = (props) => {
  return (
    <div
      class="modal fade zoomIn"
      id="logoutModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you sure ?</h4>
                <p class="text-muted mb-0">
                  Are you sure you want to logout your account?
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                class="btn w-sm create-item-btn"
                id="delete-record"
                data-bs-dismiss="modal"
                onClick={async () => {
                  await localStorage.removeItem("OrganisationLocalList");
                  await props.Logout();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
