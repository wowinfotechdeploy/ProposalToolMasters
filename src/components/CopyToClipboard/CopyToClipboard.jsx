import React, { useState } from "react";
import "./CopyToClipboardStyle.css";

const CopyToClipboard = ({ texts, heading }) => {
  const [tooltipState, setTooltipState] = useState(
    new Array(texts.length).fill(false));
  const [tooltipText, setTooltipText] = useState("");

  const handleCopyClick = (text, index) => {
    // Copy text to clipboard
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // Set tooltip text and show it for the clicked text
    setTooltipText("Copied!");
    setTooltipState((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    // Hide tooltip after a short delay
    setTimeout(() => {
      setTooltipState((prev) => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
    }, 1000);
  };

  return (
    <div>
      <p>
        <span className="CopyHeading">{heading}</span>
        {texts.map((text, index) => (
          <span
            key={index}
            style={{ cursor: "pointer" }}
            className="badge badge-secondary"
            onClick={() => handleCopyClick(text, index)}
          >
            {text}
            {tooltipState[index] && (
              <span className="custom-tooltip">{tooltipText}</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
};

export default CopyToClipboard;
