const ButtonSubmit = ({ getSubmit, label }) => {
  return (
    <button
      className="bg-blue-900 rounded-3xl px-3 py-2 w-full text-white text-sm font-semibold hover:bg-blue-700"
      onClick={getSubmit}
    >
      {label}
    </button>
  );
};

export default ButtonSubmit;


