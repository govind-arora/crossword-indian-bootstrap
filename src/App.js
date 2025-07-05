import React, { useState } from "react";
import Crossword from "./views/Crossword";

export default function App() {
  const [currentGame] = useState("crossword");

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {currentGame === "crossword" && <Crossword />}
    </div>
  );
}
