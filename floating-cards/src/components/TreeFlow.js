import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const initialNodes = [
  {
    id: "1",
    data: {
      label: "0",
      childrenCreated: false,
      collapsed: false,
      content: "",
    },
    position: { x: 250, y: 5 },
    style: { width: 150, height: 200 },
    draggable: false, // Make Branch 0 immovable
    type: "custom",
  },
];

const initialEdges = [];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 200;
const MIN_DISTANCE =
  Math.max(NODE_WIDTH, NODE_HEIGHT) + Math.max(NODE_WIDTH, NODE_HEIGHT) / 2;

const CustomNode = ({ id, data }) => (
  <div className="custom-node">
    <Handle type="target" position="bottom" /> {/* Target handle at bottom */}
    <div>{data.label}</div>
    <div>{data.content}</div> {/* Display node content */}
    <Handle type="source" position="top" /> {/* Source handle at top */}
  </div>
);

const nodeTypes = { custom: CustomNode };

const TreeFlow = ({ inputValue, updateTrigger }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  useEffect(() => {
    const updateNodeContent = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/update_content",
          { content: inputValue },
          { headers: { "Content-Type": "application/json" } }
        );

        const rewritten_text = response.data.rewritten_text;

        setNodes((nds) =>
          nds.map((node) =>
            node.id === "1"
              ? { ...node, data: { ...node.data, content: rewritten_text } }
              : node
          )
        );
      } catch (error) {
        console.error("Error updating node content:", error);
      }
    };

    if (updateTrigger) {
      updateNodeContent();
    }
  }, [inputValue, updateTrigger]);

  const handleNodeClick = (event, node) => {
    if (!node.data.childrenCreated) {
      createChildNodes(node);
    } else {
      toggleCollapseNode(node.id);
    }
  };

  const createChildNodes = (parentNode) => {
    const parentNodeId = parentNode.id;

    const newNodes = [];
    const newEdges = [];

    for (let i = 0; i < 2; i++) {
      const newNodeId = `${nodeIdCounter + i}`;
      const newNode = {
        id: newNodeId,
        data: {
          label: `Branch ${newNodeId}`,
          childrenCreated: false,
          collapsed: false,
          parentId: parentNodeId,
          content: "New Content",
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
      x: parentPosition.x + (index === 0 ? -150 : 150),
      y: parentPosition.y - 200,
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
    <ReactFlow
      nodes={nodes.map((node) => ({ ...node, type: "custom" }))}
      edges={edges}
      nodeTypes={memoizedNodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onNodeDragStop={onNodeDragStop}
      style={{ background: "transparent" }}
      fitView
    />
  );
};

const TreeFlowApp = ({ inputValue, updateTrigger }) => (
  <ReactFlowProvider>
    <TreeFlow inputValue={inputValue} updateTrigger={updateTrigger} />
  </ReactFlowProvider>
);

export default TreeFlowApp;
