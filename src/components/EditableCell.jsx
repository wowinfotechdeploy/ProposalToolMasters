import { useState } from "react";

export default function EditableCell({ value, displayValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value); // Always use full value for editing

  const handleSave = () => {
    setIsEditing(false);
    if (text !== value) {
      onSave(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const pencilLogo = <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: "4px" }}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          style={{ width: "100%" }}
        />
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
          {displayValue || text} {pencilLogo}
        </span>
      )}
    </div>
  );
}