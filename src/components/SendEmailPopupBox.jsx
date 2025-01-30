import React from "react";
import { useNavigate } from "react-router";
import EmailLogo from "../assets/images/mailticks-logo.png";

import { OutBooksTitle } from "./GlobalMessage";
function SendEmailPopUpBox(props) {
  const navigate = useNavigate();
  const SendEmailBtn = () => {
    navigate(`/activate?token=${props.token}`, {
      state: {
        token: props.token,
        email: props.email,
      },
    });
  };

  return (
    <div
      class="modal fade zoomIn"
      id={props.id}
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div
            class="modal-header"
            style={{
              paddingBottom: "10px",
              backgroundColor: "#212759",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p class="Send-Email-Header">
              <span> {props.regObj}, an email is on its way.</span>
            </p>
            <button
              style={{ background: "transparent", border: "none" }}
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="bi bi-x-lg" style={{ color: "#fff" }}></i>
            </button>
          </div>
          <div class="modal-body text-center">
            <div>
              <img src={EmailLogo} className="Send-Email-Image" />
              <p>
                Please verify the email you received on{" "}
                <span className="Send-Email-Email"> {props.email}</span> to
                activate your {OutBooksTitle} account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendEmailPopUpBox;
