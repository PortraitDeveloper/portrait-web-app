const AddButton = ({ title, openModal }) => {
  return (
    <>
      <button
        className="px-3 py-2 bg-blue-900 rounded-xl text-sm text-white font-sora hover:bg-blue-700"
        onClick={openModal}
      >
        Add {title} +
      </button>
    </>
  );
};

export default AddButton;
