/* global $ */
import React, { useContext, useState } from "react";
import editGif from "../assets/images/gif/edit.gif";
import { AuthContextProvider } from "../AuthContext/AuthContext";

function RecordsAvailablePopupModel({
  UpdatedStatus,
  openErrorModal,
  modelRequestData,
  openSuccessModal,
  modelAction,
  handleClose,
}) {
  const [showAll, setShowAll] = useState(false);
  const {
    formatValue
  } = useContext(AuthContextProvider);
  return (
    <div
      style={{ display: (openSuccessModal || openErrorModal) && "none" }}
      class="modal fade zoomIn designed-popup"
      id="RecordsAvailablePopupModel"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header" style={{ paddingBottom: "10px" }}>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => handleClose()}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              id="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="  text-center">
              <div class=" fs-15 mx-4 mx-sm-3">
                {/* <animated.div style={animation}>
                                </animated.div> */}

                {modelRequestData.Action === "ServiceWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                      {modelRequestData.ServiceName.length > 5 && (
                        <div
                          style={{ textAlign: "center", cursor: "pointer" }}
                          className="pt-2"
                        >
                          <div onClick={() => setShowAll(!showAll)}>
                            <u> {showAll ? "Show Less" : "Show More"}</u>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {modelRequestData.Action === "ServiceCategoriesWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "OrganisationWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "UserWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "PackageListWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "GlobalConstantWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "GlobalPricingDriversWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "TemplateWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "TermAndConditionWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "EmailTemplateWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "ReminderWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "ReminderTemplateWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {modelRequestData.Action === "TemplatePdfWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "150px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.ServiceName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.ServiceName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.ServiceName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
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
                {modelRequestData.Action === "DeleteDriverWarning" && (
                  <>
                    <div className="text-left">
                      <span class="text-muted mb-0 text-left">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <ul class="desined-list">
                        {modelRequestData.DriverName?.map((item) => (
                          <li key={item}>
                            {" "}
                            <span> {item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {modelRequestData.Action === "LargePriceValueWarning" && (
                  <>
                    <div className="text-left">
                      <span class="text-muted mb-0 text-left">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <ul class="desined-list">
                        {modelRequestData.DriverName?.map((item) => (
                          <li key={item.serviceID}>
                            {" "}
                            <span> {item.serviceName}: {formatValue(item.price)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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

                {modelRequestData.Action === "UserRolesWarning" && (
                  <>
                    <div>
                      <span class="text-muted mb-0">
                        {modelRequestData.message}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        height: showAll ? "300px" : "auto",
                        overflowX: showAll ? "auto" : "hidden",
                      }}
                    >
                      <ul className="desined-list">
                        {showAll
                          ? modelRequestData.UserName?.map((item) => (
                            <li key={item}>
                              {" "}
                              <span> {item}</span>
                            </li>
                          ))
                          : modelRequestData.UserName?.slice(0, 5).map(
                            (item) => (
                              <li key={item}>
                                {" "}
                                <span> {item}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {modelRequestData.UserName.length > 5 && (
                      <div
                        style={{ textAlign: "center", cursor: "pointer" }}
                        className="pt-2"
                      >
                        <div onClick={() => setShowAll(!showAll)}>
                          <u> {showAll ? "Show Less" : "Show More"}</u>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              {modelRequestData.Action === "Warning" ||
                modelRequestData.Action === "PracticeWarning" ? (
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className="btn btn-md btn-light cancel-item-btn"
                  data-bs-dismiss="modal"
                >
                  <span>No</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClose()}
                  class="btn btn-md btn-success create-item-btn"
                  data-bs-dismiss="modal"
                >
                  <span>Close</span>
                </button>
              )}

              {/* <button
                type="button"
                onClick={() => handleClose()}
                class="btn btn-md btn-light cancel-item-btn"
                data-bs-dismiss="modal"
              >
                {modelRequestData.Action === "Warning" ||
                modelRequestData.Action === "PracticeWarning" ? (
                  <span>No</span>
                ) : (
                  <span>Cancel</span>
                )}
              </button> */}
              {(modelRequestData.Action === "Warning" ||
                modelRequestData.Action === "Status" ||
                modelRequestData.Action === "Delete" ||
                modelRequestData.Action == "PracticeWarning") && (
                  <button
                    onClick={() => {
                      UpdatedStatus();
                    }}
                    type="button"
                    class="btn btn-md btn-success create-item-btn"
                  >
                    {modelRequestData.Action === "Status" && (
                      <span>Yes, Change It!</span>
                    )}
                    {modelRequestData.Action === "Delete" && (
                      <span>Yes, Delete It!</span>
                    )}
                    {modelRequestData.Action === "Warning" && <span>Yes</span>}
                    {(modelRequestData.Action === "Warning" ||
                      modelRequestData.Action == "PracticeWarning") && (
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

export default RecordsAvailablePopupModel;
