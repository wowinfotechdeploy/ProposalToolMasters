import React from "react";
import "./LogoutModal-redesign.css";

const LogoutModal = (props) => {
  return (
    <div
      className="modal fade zoomIn logout-modal-redesign"
      id="logoutModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered logout-modal-dialog">
        <div className="modal-content logout-modal-content">
          <div className="modal-header logout-modal-header">
            <h5 className="modal-title logout-modal-title">Logout</h5>

            <button
              type="button"
              className="btn-close logout-modal-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="btn-close"
            ></button>
          </div>

          <div className="modal-body logout-modal-body">
            <div className="logout-modal-message">
              <span className="logout-modal-icon">
                <i className="ri-logout-box-r-line"></i>
              </span>

              <div>
                <h4>Are you sure?</h4>
                <p>Are you sure you want to logout your account?</p>
              </div>
            </div>
          </div>

          <div className="modal-footer logout-modal-footer">
            <button
              type="button"
              className="btn logout-modal-cancel-btn"
              data-bs-dismiss="modal"
            >
              No
            </button>

            <button
              type="button"
              className="btn logout-modal-confirm-btn"
              id="delete-record"
              data-bs-dismiss="modal"
              onClick={async () => {
                await localStorage.removeItem("OrganisationLocalList");
                await props.Logout();
              }}
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
