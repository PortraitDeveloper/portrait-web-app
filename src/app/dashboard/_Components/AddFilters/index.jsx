const AddFilters = ({ openModal }) => {
  return (
    <>
      <button
        className="px-3 py-2 bg-blue-900 rounded-xl text-xs text-center text-white font-sora hover:bg-blue-700 w-42"
        onClick={openModal}
      >
        Filters
      </button>
    </>
  );
};

export default AddFilters;
