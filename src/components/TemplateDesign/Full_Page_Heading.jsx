import React, { useState } from "react";
import "./templateDesign.css";
import { ERROR_MESSAGES } from "../GlobalMessage";

function FullHeading({
  setTemplateElementList,
  templateElementList,
  index,
  requireElementTypeErrorMessage,
}) {
  const [heading, setHeading] = useState(
    templateElementList[index].headings || ""
  );
  const [shortDescription, setShortDescription] = useState(
    templateElementList[index].shortDesc || ""
  );

  const handleHeadingChange = (event) => {
    const inputValue = event.target.value;
    const trimmedValue = inputValue.replace(/^\s+/g, ""); // Trim leading spaces
    const capitalizedValue =
      trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);
    const updatedTemplateElementList = [...templateElementList];
    updatedTemplateElementList[index] = {
      ...updatedTemplateElementList[index],
      headings: capitalizedValue,
    };
    setHeading(capitalizedValue); // Update the heading state without leading spaces
    setTemplateElementList(updatedTemplateElementList);
  };

  const handleShortDescriptionChange = (event) => {
    const inputValue = event.target.value;
    const trimmedValue = inputValue.replace(/^\s+/g, ""); // Trim leading spaces
    const capitalizedValue =
      trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);

    const updatedTemplateElementList = [...templateElementList];
    updatedTemplateElementList[index] = {
      ...updatedTemplateElementList[index],
      shortDesc: capitalizedValue,
    };
    setShortDescription(capitalizedValue); // Update the shortDescription state
    setTemplateElementList(updatedTemplateElementList);
  };

  return (
    <>
      <div className="row fieldset" id={`FullPageHeadingDiv_${heading}`}>
        <div className="col-md-2">
          <label className="fieldset-label required">
            Heading
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-md-10">
          <input
            className="input-text"
            type="text"
            placeholder="Heading"
            value={heading}
            onChange={handleHeadingChange}
            maxLength={200}
          />
          {requireElementTypeErrorMessage.headings &&
          (templateElementList[index]?.headings === "" ||
            templateElementList[index]?.headings === null) ? (
            <label className="validation">{ERROR_MESSAGES}</label>
          ) : (
            ""
          )}
        </div>
      </div>
      <div
        className="row fieldset"
        id={`FullPageShortDescriptionDiv_${shortDescription}`}
      >
        <div className="col-md-2 mt-2">
          <label className="fieldset-label required">
            Short Description
            <span className="text-danger">*</span>
          </label>
        </div>
        <div className="col-md-10">
          <input
            className="input-text"
            type="text"
            placeholder="Short Description"
            value={shortDescription}
            onChange={handleShortDescriptionChange}
            maxLength={200}
          />
          {requireElementTypeErrorMessage.shortDesc &&
          (templateElementList[index]?.shortDesc === "" ||
            templateElementList[index]?.shortDesc === null) ? (
            <label className="validation">{ERROR_MESSAGES}</label>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default FullHeading;
