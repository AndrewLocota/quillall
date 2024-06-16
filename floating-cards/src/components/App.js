import React, { useState } from "react";
import TreeFlowApp from "./TreeFlow";
import BottomPanel from "./BottomPanel";
import "./App.css"; // Ensure you have styles for the components

function App() {
  const [inputValue, setInputValue] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const updateBranchContent = (rewrittenText) => {
    setInputValue(rewrittenText);
    setUpdateTrigger(!updateTrigger);
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
}

export default App;
