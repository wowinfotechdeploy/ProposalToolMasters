import React, { useState } from "react";
import Text_Editor from "./Text_Editor";

const PricingTableCustomizationModal = ({
  show,
  onHide,
  currentPricingTableDesignOneOff,
  setCurrentPricingTableDesignOneOff,
  currentPricingTableDesignRecurring,
  setCurrentPricingTableDesignRecurring,
  serviceTypeID,
}) => {
  const [customizedTableContent, setCustomizedTableContent] = useState("");

  if (!show) return null; // Do not render if show is false

  const handleContentChange = async (newContent) => {
    setCustomizedTableContent(newContent);
  };

  const handleUpdateHtml = async () => {
    if (customizedTableContent !== "") {
      if (serviceTypeID === 1) {
        setCurrentPricingTableDesignRecurring(customizedTableContent);
      } else {
        setCurrentPricingTableDesignOneOff(customizedTableContent);
      }
    }
    onHide();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
        onClick={onHide} // Optional: click on backdrop closes modal
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1050,
        }}
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light p-3">
              <h5 className="modal-title" id="modalLabel">
                Customize Default Pricing Table
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onHide}
              ></button>
            </div>

            <div className="modal-body">
              {/* <p className="text-muted text-center">Customization modal</p> */}
              <div className="separator mb-3">
                <Text_Editor
                  index={0}
                  handleContentChange={handleContentChange}
                  editorState={
                    serviceTypeID === 1
                      ? currentPricingTableDesignRecurring
                      : currentPricingTableDesignOneOff
                  }

                  // modelAction={modelAction}
                />
                {/* {requireElementTypeErrorMessage.htmlContent &&
                (templateElementList[index]?.htmlContent === "" ||
                  templateElementList[index]?.htmlContent === null ||
                  templateElementList[index]?.htmlContent === "<p><br></p>" ||
                  templateElementList[index]?.htmlContent === undefined) ? (
                  <label className="validation">{ERROR_MESSAGES}</label>
                ) : (
                  ""
                )} */}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-md btn-success create-item-btn"
                onClick={onHide}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-md btn-success create-item-btn"
                onClick={handleUpdateHtml}
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingTableCustomizationModal;
