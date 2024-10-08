import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, { useNodesState, useEdgesState, Handle } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import "./App"; // Ensure you import the CSS file

const initialNodes = [
  {
    id: "1",
    data: {
      label: "", // Branch 0
      childrenCreated: false,
      collapsed: false,
      content: "Business goes here:",
    },
    position: { x: 250, y: 5 },
    draggable: false, // Make Branch 0 immovable
    type: "custom",
    aspectRatio: 5 / 3,
  },
];

const initialEdges = [];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 200;
const MIN_DISTANCE =
  Math.max(NODE_WIDTH, NODE_HEIGHT) + Math.max(NODE_WIDTH, NODE_HEIGHT) / 2;

const CustomNode = ({ id, data }) => {
  const calculateSize = (text) => {
    const baseWidth = 150;
    const baseHeight = 200;
    const charCount = text.length;
    const scaleFactor = Math.sqrt(charCount / 20); // Adjust based on average character count fitting in base size
    const minWidth = 170;
    const minHeight = 200;
    const maxWidth = 275; // Max width based on desired number of words per line
    const newWidth = Math.max(minWidth, baseWidth * scaleFactor);
    const newHeight = Math.max(minHeight, baseHeight * scaleFactor);
    const aspectRatio = 3 / 4;

    if (newWidth / newHeight > aspectRatio) {
      return {
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newWidth / aspectRatio, maxWidth / aspectRatio),
      };
    } else {
      return {
        width: Math.min(newHeight * aspectRatio, maxWidth),
        height: Math.min(newHeight, maxWidth / aspectRatio),
      };
    }
  };

  const size = calculateSize(data.content);

  return (
    <div
      className="custom-node"
      style={{
        width: size.width,
        height: size.height,
        transition: "width 0.5s, height 0.5s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Handle type="target" position="bottom" /> {/* Target handle at bottom */}
      <div>{data.label}</div>
      <div
        style={{
          wordWrap: "break-word",
          maxWidth: size.width,
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {String(data.content)}
      </div>
      <Handle type="source" position="top" /> {/* Source handle at top */}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const TreeFlow = ({ inputValue, updateTrigger }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  useEffect(() => {
    if (updateTrigger) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === "1"
            ? { ...node, data: { ...node.data, content: inputValue } }
            : node
        )
      );
    }
  }, [updateTrigger, inputValue]);

  const handleNodeClick = async (event, node) => {
    if (!node.data.childrenCreated) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/node_click",
          {
            content: node.data.content,
          }
        );

        const { answer } = response.data;
        const option1Index = answer.indexOf("Option 1:");
        const option2Index = answer.indexOf("Option 2:");

        const option1 = answer
          .slice(option1Index, option2Index)
          .replace("Option 1:", "")
          .trim();
        const option2 = answer
          .slice(option2Index)
          .replace("Option 2:", "")
          .trim();

        createChildNodes(node, option1, option2);
      } catch (error) {
        console.error("Error processing node click:", error);
      }
    } else {
      toggleCollapseNode(node.id);
    }
  };

  const createChildNodes = (parentNode, option1, option2) => {
    const parentNodeId = parentNode.id;

    const newNodes = [];
    const newEdges = [];

    for (let i = 0; i < 2; i++) {
      const newNodeId = `${nodeIdCounter + i}`;
      const newNodeContent = i === 0 ? option1 : option2;
      const newNode = {
        id: newNodeId,
        data: {
          label: `Branch ${newNodeId}`,
          childrenCreated: false,
          collapsed: false,
          parentId: parentNodeId,
          content: newNodeContent,
        },
        position: calculateNodePosition(parentNode.position, i),
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        type: "custom",
      };

      newNodes.push(newNode);

      const newEdge = {
        id: `e${parentNodeId}-${newNodeId}`,
        source: parentNodeId,
        target: newNodeId,
        sourceHandle: "top",
        targetHandle: "bottom",
        animated: true,
        style: { stroke: "#000" },
      };
      newEdges.push(newEdge);
    }

    setNodeIdCounter((id) => id + 2);
    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));
    setNodes((nds) =>
      nds.map((node) =>
        node.id === parentNodeId
          ? { ...node, data: { ...node.data, childrenCreated: true } }
          : node
      )
    );
  };

  const calculateNodePosition = (parentPosition, index) => {
    return {
      x: parentPosition.x + (index === 0 ? -350 : 350),
      y: parentPosition.y - 450, // Move the child nodes even higher on the y-axis
    };
  };

  const distance = (pos1, pos2) => {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
  };

  const toggleCollapseNode = (parentNodeId) => {
    const affectedNodes = getDescendants(parentNodeId);
    setNodes((nds) =>
      nds.map((node) => {
        if (affectedNodes.includes(node.id)) {
          return {
            ...node,
            hidden: !node.hidden,
            style: { ...node.style, transition: "opacity 0.5s" },
          };
        }
        return node;
      })
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (affectedNodes.includes(edge.target)) {
          return { ...edge, hidden: !edge.hidden };
        }
        return edge;
      })
    );
  };

  const getDescendants = (parentId) => {
    const descendants = [];
    const addDescendants = (nodeId) => {
      nodes.forEach((node) => {
        if (node.data.parentId === nodeId) {
          descendants.push(node.id);
          addDescendants(node.id);
        }
      });
    };
    addDescendants(parentId);
    return descendants;
  };

  const preventOverlap = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      for (let i = 0; i < updatedNodes.length; i++) {
        for (let j = i + 1; j < updatedNodes.length; j++) {
          const nodeA = updatedNodes[i];
          const nodeB = updatedNodes[j];
          const dist = distance(nodeA.position, nodeB.position);
          if (dist < MIN_DISTANCE) {
            const angle = Math.atan2(
              nodeB.position.y - nodeA.position.y,
              nodeB.position.x - nodeA.position.x
            );
            const moveDistance = (MIN_DISTANCE - dist) / 2;
            nodeA.position.x -= moveDistance * Math.cos(angle);
            nodeA.position.y -= moveDistance * Math.sin(angle);
            nodeB.position.x += moveDistance * Math.cos(angle);
            nodeB.position.y += moveDistance * Math.sin(angle);
          }
        }
      }
      return updatedNodes;
    });
  }, [setNodes]);

  useEffect(() => {
    const interval = setInterval(preventOverlap, 10);
    return () => clearInterval(interval);
  }, [preventOverlap]);

  const onNodeDragStop = useCallback(() => {
    preventOverlap();
  }, [preventOverlap]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes.map((node) => ({ ...node, type: "custom" }))}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={onNodeDragStop}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        fitView
      />
    </div>
  );
};

export default TreeFlow;
