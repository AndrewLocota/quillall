import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const BottomPanel = ({ inputValue, setInputValue, updateBranchContent }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        String(inputRef.current.value).trim() !== ""
      ) {
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
        value={String(inputValue)}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter initial content for Branch 0"
        className="bottom-panel-input"
      />
      <button
        onClick={updateBranchContent}
        className="bottom-panel-button"
        disabled={String(inputValue).trim() === ""}
      >
        Update
      </button>
    </div>
  );
};

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");

  const updateBranchContent = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/update_content", {
        content: inputValue,
      });
      setResponse(res.data.answer);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  return (
    <div>
      <BottomPanel
        inputValue={inputValue}
        setInputValue={setInputValue}
        updateBranchContent={updateBranchContent}
      />
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default App;
