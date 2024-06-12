// src/components/TreeNode.js
import React, { useEffect, useRef, useState } from "react";

const TreeNode = ({ data, parentRef, moveToCenter, registerNode }) => {
  const [collapsed, setCollapsed] = useState(true);
  const nodeRef = useRef(null);
  const childRefs = useRef([]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (nodeRef.current) {
      moveToCenter(nodeRef.current);
    }
  };

  useEffect(() => {
    if (!collapsed) {
      childRefs.current = data.children.map(() => React.createRef());
    }
  }, [collapsed, data.children]);

  useEffect(() => {
    if (nodeRef.current) {
      registerNode({
        ref: nodeRef,
        children: childRefs.current.map((ref, index) => ({
          ref,
          data: data.children[index],
        })),
      });
    }
  }, [registerNode, data.children]);

  return (
    <div className="tree-node" ref={nodeRef}>
      <div
        className={`tree-node-content bg-white shadow-md rounded-lg p-4 m-2 cursor-pointer border-2 border-black ${
          collapsed ? "" : "expanded"
        }`}
        onClick={toggleCollapse}
      >
        <h3 className="font-bold">{data.name}</h3>
        <p>{data.description}</p>
      </div>
      <div
        className={`children-container ${collapsed ? "collapsed" : "expanded"}`}
      >
        {data.children &&
          data.children.map((childData, index) => (
            <TreeNode
              key={index}
              data={childData}
              parentRef={nodeRef}
              moveToCenter={moveToCenter}
              registerNode={registerNode}
              ref={childRefs.current[index]}
            />
          ))}
      </div>
    </div>
  );
};

export default TreeNode;
