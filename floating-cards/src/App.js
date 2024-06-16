import React, { useState } from "react";
import BottomPanel from "./components/BottomPanel";
import TreeFlow from "./components/TreeFlow";
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
      setInputValue(""); // Clear input after sending it to the API
      setUpdateTrigger((prev) => !prev); // Trigger the update in TreeFlow
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
      <TreeFlow inputValue={response} updateTrigger={updateTrigger} />
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default App;
