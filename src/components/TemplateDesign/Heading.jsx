import React, { useState } from "react";
import "./templateDesign.css";
import { ERROR_MESSAGES } from "../GlobalMessage";

function Heading({
  setTemplateElementList,
  templateElementList,
  index,
  requireElementTypeErrorMessage,
}) {
  const handleHeadingChange = (event) => {
    const updatedTemplateElementList = [...templateElementList]; // Create a copy of the list
    updatedTemplateElementList[index] = {
      ...updatedTemplateElementList[index],
      headings: event.target.value, // Update the heading at the specified index
    };
    setTemplateElementList(updatedTemplateElementList); // Set the updated list
  };

  return (
    <div
      className="row fieldset"
      id={`HeadingDiv_${templateElementList[index].headings}`}
    >
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
          value={templateElementList[index].headings || ""}
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
  );
}

export default Heading;
