import React from "react";

const SubmitButton = ({ getSubmit, label }) => {
  return (
    <button
      className="bg-blue-900 rounded-3xl px-3 py-2.5 w-full text-white hover:bg-blue-700"
      onClick={getSubmit}
    >
      {label}
    </button>
  );
};

export default SubmitButton;


