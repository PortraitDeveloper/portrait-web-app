const ButtonDelete = ({ getDelete }) => {
  return (
    <div>
      <button
        className="border border-red-500 rounded-2xl px-6 py-2.5 text-red-500 bg-red-50 hover:bg-red-100"
        onClick={getDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ButtonDelete;
