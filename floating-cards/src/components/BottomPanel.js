import React, { useRef, useEffect } from "react";

const BottomPanel = ({ inputValue, setInputValue, updateBranchContent }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && inputRef.current.value.trim() !== "") {
        updateBranchContent();
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener("keydown", handleKeyDown);

    return () => {
      inputElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateBranchContent]);

  return (
    <div className="bottom-panel">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter initial content for Branch 0"
        className="bottom-panel-input"
      />
      <button
        onClick={updateBranchContent}
        className="bottom-panel-button"
        disabled={inputValue.trim() === ""}
      >
        Update
      </button>
    </div>
  );
};

export default BottomPanel;
