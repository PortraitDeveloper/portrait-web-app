const Label = ({ id, name }) => {
  return (
    <div className="bg-slate-200 rounded-2xl text-center font-semibold px-3 py-2.5 w-72">
      <p>{id.toUpperCase()}</p>
      <p>{name}</p>
    </div>
  );
};

export default Label;
