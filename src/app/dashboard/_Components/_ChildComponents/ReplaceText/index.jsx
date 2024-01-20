/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceText = ({ inputName, placeHolder, value, getText }) => {
  const [replaceValue, setReplaceValue] = useState(value);

  useEffect(() => {
    getText(value);
  }, []);

  const changeHandler = (e) => {
    const newValue = e.target.value;
    setReplaceValue(newValue);
    getText(newValue);
  };

  return (
    <textarea
      id={inputName}
      name={inputName}
      placeholder={placeHolder}
      value={replaceValue}
      className="border border-black rounded-3xl px-3 py-2 w-72"
      onChange={changeHandler}
      rows={4}
      style={{ resize: "vertical" }}
    />
  );
};

export default ReplaceText;
