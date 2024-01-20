const InputText = ({ inputName, placeHolder, getText }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getText(value);
  };

  return (
    <textarea
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      className="border border-black rounded-3xl px-3 py-2 w-72"
      onChange={changeHandler}
      rows={4}
      style={{ resize: "vertical" }} 
    />
  );
};

export default InputText;
