// src/App.js
import React from "react";
import TreeContainer from "./components/TreeContainer";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">Floating Cards</h1>
      </header>
      <main className="p-4">
        <TreeContainer />
      </main>
    </div>
  );
}

export default App;
