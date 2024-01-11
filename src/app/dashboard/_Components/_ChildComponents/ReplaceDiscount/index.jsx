/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceDiscount = ({
  placeHolder,
  unit,
  getDiscount,
}) => {
  const changeHandler = (e) => {
    const newDiscount = e.target.value;
    getDiscount(newDiscount);
  };

  return (
    <div className="w-72">
      <div className="flex justify-between items-center">
        <input
          type="number"
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

export default ReplaceDiscount;
