/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceSoftfile = ({ value, getNumber }) => {
  const [replaceValue, setReplaceValue] = useState(value);

  useEffect(() => {
    setReplaceValue(value);
    getNumber(value);
  }, []);

  const changeHandler = (e) => {
    const newValue = e.target.value;
    getNumber(newValue);
  };

  return (
    <>
      {replaceValue === 1 && (
        <select
          name="selectProduct"
          id="selectProduct"
          className="border border-black rounded-xl font-roboto px-3 py-2 w-20"
          required
          onChange={changeHandler}
        >
          <option value={replaceValue}>
            {replaceValue === 1 ? "Yes" : "No"}
          </option>
          {value !== 0 && <option value={0}>No</option>}
        </select>
      )}

      {replaceValue === 0 && (
        <select
          name="selectProduct"
          id="selectProduct"
          className="border border-black rounded-xl font-roboto px-3 py-1 w-20"
          required
          onChange={changeHandler}
        >
          <option value={replaceValue}>
            {replaceValue === 0 ? "No" : "Yes"}
          </option>
          {value !== 1 && <option value={1}>Yes</option>}
        </select>
      )}
    </>
  );
};

export default ReplaceSoftfile;
