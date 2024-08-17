import React, { useEffect } from "react";
import "./LandingAnimation.css"; // Assuming you have a CSS file for styling
import logo from "./images/logo.png"; // Correct path

const LandingAnimation = () => {
  useEffect(() => {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      setTimeout(() => {
        loadingElement.classList.add("crop-to-top");
      }, 1500); // 1.50 seconds
    }
  }, []);

  return (
    <div id="loading">
      <div className="background"></div>
      <img src={logo} alt="Logo" id="logo" />
    </div>
  );
};

export default LandingAnimation;
