const ReplaceNominal = ({
  placeHolder,
  unit,
  getDiscount,
}) => {
  const changeHandler = (e) => {
    const newDiscount = e.target.value;
    getDiscount(newDiscount);
  };

  return (
    <div className="border border-black rounded-3xl px-3 py-1.5 w-36">
      <div className="flex justify-between items-center">
      <p className="mr-2">{unit}</p>
        <input
          type="number"
          placeholder={placeHolder}
          outline="none"
          className="outline-none w-full"
          onChange={changeHandler}
        />
       
      </div>
    </div>
  );
};

export default ReplaceNominal;
