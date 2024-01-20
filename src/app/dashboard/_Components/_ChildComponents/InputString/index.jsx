const InputString = ({ inputName, placeHolder, getString }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getString(value);
  };

  return (
    <input
      type="text"
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      outline="none"
      className="border border-black rounded-3xl px-3 py-2 w-full"
      onChange={changeHandler}
    />
  );
};

export default InputString;
