const AddButton = ({ title, openModal }) => {
  return (
    <>
      <button
        onClick={openModal}
        className="px-3 py-2.5 border border-black rounded-xl text-sm font-sora hover:bg-blue-900 hover:text-white"
      >
        Add {title} +
      </button>
    </>
  );
};

export default AddButton;
