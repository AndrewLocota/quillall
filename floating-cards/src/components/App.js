import React, { useState } from "react";
import BottomPanel from "./BottomPanel"; // Ensure this path is correct
import TreeFlow from "./TreeFlow"; // Ensure this path is correct
import axios from "axios";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const updateBranchContent = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/update_content", {
        content: inputValue,
      });
      setResponse(res.data.answer);
      setUpdateTrigger((prev) => !prev); // Trigger the update in TreeFlow
    } catch (error) {
      console.error("Error updating content:", error);
    }
    setInputValue(""); // Clear input after sending it to the API
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <TreeFlow inputValue={response} updateTrigger={updateTrigger} />
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
