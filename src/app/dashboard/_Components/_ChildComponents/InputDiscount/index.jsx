const InputDiscount = ({ inputName, unit, placeHolder, getDiscount }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getDiscount(value);
  };

  return (
    <div className="w-72">
      <div className="flex justify-between items-center">
        <input
          type="number"
          id={inputName}
          name={inputName}
          placeholder={placeHolder}
          outline="none"
          className="border border-black rounded-3xl px-3 py-2.5"
          onChange={changeHandler}
        />
        <p className="text-xl">{unit}</p>
      </div>
    </div>
  );
};

export default InputDiscount;
