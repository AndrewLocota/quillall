// src/components/CustomNode.js
import React, { useState, useEffect } from "react";
import { Handle } from "reactflow";

const labelStyle = {
  textAlign: "center",
  width: "100%",
};

const CustomNode = ({ id, data, isConnectable }) => {
  const [content, setContent] = useState(data.content);

  useEffect(() => {
    data.onChange(id, content);
  }, [content, id, data]);

  return (
    <div className="custom-node">
      <Handle type="target" position="bottom" isConnectable={isConnectable} />{" "}
      {/* Target handle at bottom */}
      <div
        className="custom-drag-handle"
        style={{ border: "2px solid transparent", padding: "10px" }}
      >
        <div style={labelStyle}>{data.label}</div>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", marginTop: "10px" }}
        />
      </div>
      <Handle type="source" position="top" isConnectable={isConnectable} />{" "}
      {/* Source handle at top */}
    </div>
  );
};

export default CustomNode;
