// src/components/App.js
import React, { useState } from "react";
import TreeFlowApp from "./TreeFlow";
import BottomPanel from "./BottomPanel";
import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const updateBranchContent = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <div className="treeflow-container">
        <TreeFlowApp inputValue={inputValue} updateTrigger={updateTrigger} />
      </div>
      <BottomPanel
        inputValue={inputValue}
        setInputValue={setInputValue}
        updateBranchContent={updateBranchContent}
      />
    </div>
  );
};

export default App;
