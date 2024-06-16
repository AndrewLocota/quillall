import React, { useState } from "react";
import TreeFlowApp from "./components/TreeFlow";
import BottomPanel from "./components/BottomPanel";
import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const updateBranchContent = () => {
    setUpdateTrigger(!updateTrigger); // Toggle the update trigger to initiate the update
  };

  return (
    <div className="app-container">
      <ErrorBoundary>
        <div className="treeflow-container">
          <TreeFlowApp inputValue={inputValue} updateTrigger={updateTrigger} />
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <BottomPanel
          inputValue={inputValue}
          setInputValue={setInputValue}
          updateBranchContent={updateBranchContent}
        />
      </ErrorBoundary>
    </div>
  );
};

export default App;
