// src/components/TreeContainer.js
import React from "react";
import TreeFlow from "./TreeFlow";

const TreeContainer = () => {
  const treeData = {
    name: "Branch 0",
    description: "Our focus is on scaling + implementing AI",
    children: [
      {
        name: "Branch 1",
        description: "Details about branch 1",
        children: [
          {
            name: "Sub-Branch 1.1",
            description: "Details about sub-branch 1.1",
            children: [
              {
                name: "Leaf 1.1.1",
                description: "Details about leaf 1.1.1",
                children: [],
              },
              {
                name: "Leaf 1.1.2",
                description: "Details about leaf 1.1.2",
                children: [],
              },
            ],
          },
          {
            name: "Sub-Branch 1.2",
            description: "Details about sub-branch 1.2",
            children: [
              {
                name: "Leaf 1.2.1",
                description: "Details about leaf 1.2.1",
                children: [],
              },
              {
                name: "Leaf 1.2.2",
                description: "Details about leaf 1.2.2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: "Branch 2",
        description: "Details about branch 2",
        children: [
          {
            name: "Sub-Branch 2.1",
            description: "Details about sub-branch 2.1",
            children: [
              {
                name: "Leaf 2.1.1",
                description: "Details about leaf 2.1.1",
                children: [],
              },
              {
                name: "Leaf 2.1.2",
                description: "Details about leaf 2.1.2",
                children: [],
              },
            ],
          },
          {
            name: "Sub-Branch 2.2",
            description: "Details about sub-branch 2.2",
            children: [
              {
                name: "Leaf 2.2.1",
                description: "Details about leaf 2.2.1",
                children: [],
              },
              {
                name: "Leaf 2.2.2",
                description: "Details about leaf 2.2.2",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <TreeFlow treeData={treeData} />
    </div>
  );
};

export default TreeContainer;
