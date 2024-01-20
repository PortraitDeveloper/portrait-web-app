/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceString = ({ inputName, placeHolder, value, getString }) => {
  const [replaceValue, setReplaceValue] = useState(value);

  useEffect(() => {
    getString(value);
  }, []);

  const changeHandler = (e) => {
    const newValue = e.target.value;
    setReplaceValue(newValue);
    getString(newValue);
  };

  return (
    <input
      type="text"
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      value={replaceValue}
      outline="none"
      className="border border-black rounded-3xl px-3 py-2 w-72"
      onChange={changeHandler}
    />
  );
};

export default ReplaceString;
