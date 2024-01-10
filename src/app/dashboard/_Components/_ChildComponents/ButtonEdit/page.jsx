const ButtonEdit = ({ data, getEdit }) => {
  const clickHandler = () => {
    getEdit(data);
  };

  return (
    <button
      className="border border-blue-900 rounded-3xl px-3 py-1 sm:px-6 sm:py-2 text-blue-900 text-sm hover:bg-blue-900 hover:text-white"
      onClick={clickHandler}
    >
      Edit
    </button>
  );
};

export default ButtonEdit;
