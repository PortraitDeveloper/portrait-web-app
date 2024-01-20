const InputPercentage = ({ inputName, unit, placeHolder, getDiscount }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getDiscount(value);
  };

  return (
    <div className="border border-black rounded-3xl px-3 py-1.5 w-36">
      <div className="flex justify-between items-center">
        <input
          type="number"
          id={inputName}
          name={inputName}
          placeholder={placeHolder}
          outline="none"
          className="outline-none w-full mr-3"
          onChange={changeHandler}
        />
        <p>{unit}</p>
      </div>
    </div>
  );
};

export default InputPercentage;
