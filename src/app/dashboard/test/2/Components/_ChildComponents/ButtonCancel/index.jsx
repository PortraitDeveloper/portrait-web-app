const ButtonCancel = ({ getCancel }) => {
  return (
    <div>
      <button
        className="border border-black rounded-2xl px-6 py-2.5 bg-gray-50 hover:bg-gray-100"
        onClick={() => {
          getCancel();
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default ButtonCancel;
