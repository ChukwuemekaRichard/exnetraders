"use client";
// components/CustomLoader.jsx
import React from "react";

const CustomLoader = ({ size = "md", text = "Loading..." }) => {
  // Size mapping
  const sizeClasses = {
    sm: {
      container: "h-4 w-4",
      outer: "h-4 w-4 border-2",
      inner: "h-2 w-2",
    },
    md: {
      container: "h-8 w-8",
      outer: "h-8 w-8 border-3",
      inner: "h-4 w-4",
    },
    lg: {
      container: "h-12 w-12",
      outer: "h-12 w-12 border-4",
      inner: "h-6 w-6",
    },
    xl: {
      container: "h-16 w-16",
      outer: "h-16 w-16 border-4",
      inner: "h-8 w-8",
    },
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${selectedSize.container}`}>
        {/* Outer spinning circle */}
        <div
          className={`absolute ${selectedSize.outer} rounded-full border-transparent border-t-blue-900 border-r-blue-900 animate-spin`}
          style={{ animationDuration: "1.5s" }}
        ></div>

        {/* Inner spinning circle */}
        <div
          className={`absolute ${selectedSize.inner} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-transparent border-b-blue-900 border-l-blue-900 animate-spin`}
          style={{ animationDuration: "1s", animationDirection: "reverse" }}
        ></div>
      </div>
      
      {text && (
        <p className="mt-3 text-sm font-medium text-blue-900">{text}</p>
      )}
    </div>
  );
};

export default CustomLoader;