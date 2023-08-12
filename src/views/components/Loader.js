import React from "react";

const Loader = ({ size }) => (
  <span
    style={{ height: `${size ?? 100}px`, width: `${size ?? 100}px` }}
    className="loader container"
  />
);

export default Loader;
