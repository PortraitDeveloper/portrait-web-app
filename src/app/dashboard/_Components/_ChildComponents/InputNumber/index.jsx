const InputNumber = ({ inputName, placeHolder, getNumber }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getNumber(value);
  };

  return (
    <input
      type="number"
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      outline="none"
      className="border border-black rounded-3xl px-3 py-2.5 w-72"
      onChange={changeHandler}
    />
  );
};

export default InputNumber;
