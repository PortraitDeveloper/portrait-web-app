const ButtonEdit = ({ data, getEdit }) => {
  const clickHandler = () => {
    getEdit(data);
  };

  return (
    <button
      className="border border-blue-900 rounded-3xl px-6 py-2 text-blue-900 text-sm hover:bg-blue-900 hover:text-white"
      onClick={clickHandler}
    >
      Edit
    </button>
  );
};

export default ButtonEdit;
