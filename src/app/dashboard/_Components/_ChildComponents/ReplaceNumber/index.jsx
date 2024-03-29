/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceNumber = ({ inputName, placeHolder, value, getNumber }) => {
  const [replaceValue, setReplaceValue] = useState(value);

  useEffect(() => {
    getNumber(value);
  }, []);

  const changeHandler = (e) => {
    const newValue = e.target.value;
    setReplaceValue(newValue);
    getNumber(newValue);
  };

  return (
    <input
      type="number"
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      value={replaceValue}
      outline="none"
      min="0"
      className="border border-black rounded-3xl px-3 py-2 w-full"
      onChange={changeHandler}
    />
  );
};

export default ReplaceNumber;
