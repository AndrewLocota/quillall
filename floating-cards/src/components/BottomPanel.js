import React, { useRef, useEffect } from "react";

const BottomPanel = ({ inputValue, setInputValue, updateBranchContent }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        String(inputRef.current.value).trim() !== ""
      ) {
        updateBranchContent();
        setInputValue("");
      }
    };

    const inputElement = inputRef.current;
    inputElement.addEventListener("keydown", handleKeyDown);

    return () => {
      inputElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateBranchContent, setInputValue]);

  return (
    <div className="bottom-panel">
      <input
        ref={inputRef}
        type="text"
        value={String(inputValue)}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter your business' details:"
        className="bottom-panel-input"
      />
      <button
        onClick={() => {
          updateBranchContent();
          setInputValue("");
        }}
        className="bottom-panel-button"
        disabled={String(inputValue).trim() === ""}
      >
        Update
      </button>
    </div>
  );
};

export default BottomPanel;
