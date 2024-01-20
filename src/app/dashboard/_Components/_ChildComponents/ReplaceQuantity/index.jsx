/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceQuantity = ({ inputName, placeHolder, value, getNumber }) => {
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
    <div className="flex justify-between items-center border border-black rounded-xl px-3 py-1 w-20">
      <p>x</p>
      <input
        type="number"
        id={inputName}
        name={inputName}
        placeholder={placeHolder}
        value={replaceValue}
        outline="none"
        min="0"
        onChange={changeHandler}
        className="outline-none ml-1 w-12"
      />
    </div>
  );
};

export default ReplaceQuantity;
