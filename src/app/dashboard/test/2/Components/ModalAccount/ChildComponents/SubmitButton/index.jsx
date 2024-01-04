import React from "react";

const SubmitButton = ({ getSubmit }) => {
  return (
    <button
      className="bg-blue-900 rounded-xl px-3 py-2.5 w-72 text-white hover:bg-blue-700"
      onClick={getSubmit}
    >
      Save
    </button>
  );
};

export default SubmitButton;


