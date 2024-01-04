import React from "react";

const ModalProduct = ({ isVisible, closeModal }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "container" || e.target.id === "button") closeModal();
  };

  if (!isVisible) return null;

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white p-4 rounded-xl">
        <p>ModalProduct</p>
        <button id="button" onClick={handleOnClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default ModalProduct;
