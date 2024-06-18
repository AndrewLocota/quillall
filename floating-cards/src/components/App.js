import React, { useState } from "react";
import BottomPanel from "./BottomPanel";
import TreeFlow from "./TreeFlow";
import axios from "axios";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [branch0Content, setBranch0Content] = useState("");

  const updateBranchContent = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/update_content", {
        content: inputValue,
      });
      setBranch0Content(res.data.answer); // Update Branch 0 content with API response
      setUpdateTrigger((prev) => !prev); // Trigger the update in TreeFlow
      setInputValue(""); // Clear the input field after updating Branch 0
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <TreeFlow inputValue={branch0Content} updateTrigger={updateTrigger} />
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
