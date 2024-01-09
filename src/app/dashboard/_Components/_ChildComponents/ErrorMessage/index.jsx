import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <>
      <p className="text-sm text-center font-bold font-sora text-red-500 w-72">
        {message}
      </p>
    </>
  );
};

export default ErrorMessage;
