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

function createNode(data, parentNode = null) {
  const node = document.createElement("div");
  node.className = "tree-node tree-branch collapsed";

  const nodeContent = document.createElement("div");
  nodeContent.className = "tree-node-content";
  nodeContent.innerHTML = `<h3 class="font-bold">${data.name}</h3><p>${data.description}</p>`;

  nodeContent.onclick = function (event) {
    event.stopPropagation(); // Prevent event from bubbling up to parent nodes

    console.log(`Clicked on node: ${data.name}`);

    const childrenContainer = node.querySelector(
      ":scope > .children-container"
    );
    if (childrenContainer) {
      const isCollapsed = childrenContainer.classList.contains("collapsed");
      const childNodes = childrenContainer.querySelectorAll(".tree-node");

      if (isCollapsed) {
        // Expand the immediate children
        console.log(`Expanding children of node: ${data.name}`);
        childrenContainer.classList.remove("collapsed");
        const height = childrenContainer.scrollHeight;
        childrenContainer.style.height = `${height}px`;
        setTimeout(() => {
          childrenContainer.style.height = "auto";
        }, 1000); // 1s duration to match the CSS transition
        childNodes.forEach((child) => child.classList.remove("collapsed"));
        childrenContainer.style.opacity = "1"; // Ensure opacity transition
      } else {
        // Collapse the immediate children
        console.log(`Collapsing children of node: ${data.name}`);
        childrenContainer.style.height = `${childrenContainer.scrollHeight}px`;
        requestAnimationFrame(() => {
          childrenContainer.style.height = "0px";
        });
        childNodes.forEach((child) => {
          if (!child.classList.contains("collapsed")) {
            child.classList.add("collapsed");
          }
        });
        setTimeout(() => {
          childrenContainer.classList.add("collapsed");
          childrenContainer.style.height = "0px";
          childrenContainer.style.opacity = "0"; // Ensure opacity transition
        }, 1000); // 1s duration to match the CSS transition
      }
    } else {
      console.log(`No children container found for node: ${data.name}`);
    }
  };

  node.appendChild(nodeContent);

  if (data.children && data.children.length > 0) {
    const childrenContainer = document.createElement("div");
    childrenContainer.className = "children-container collapsed";
    data.children.forEach((childData) => {
      const childNode = createNode(childData, node);
      childrenContainer.appendChild(childNode);
    });
    node.appendChild(childrenContainer);
  }

  return node;
}

const decisionTreeContainer = document.getElementById("branch-0");
const rootNode = createNode(treeData);
decisionTreeContainer.appendChild(rootNode);
rootNode.classList.remove("collapsed"); // Start with the root node expanded
