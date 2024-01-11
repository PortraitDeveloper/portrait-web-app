/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceDiscountType = ({ voucherType, getType }) => {
  const [voucherType_, setVoucherType_] = useState("");
  const [typeValue, setTypeValue] = useState("");

  useEffect(() => {
    console.log(voucherType)
    const _voucherType =
      voucherType === "percentage" ? "Persentase" : "Nominal";

    setVoucherType_(_voucherType);
    setTypeValue(voucherType);
    getType(voucherType);
  }, []);

  const changeHandler = (e) => {
    const value = e.target.value;
    getType(value);
  };

  return (
    <select
      name="discountType"
      id="discountType"
      className="border border-black rounded-3xl font-roboto px-3 py-2.5 w-72"
      required
      onChange={changeHandler}
    >
      <option value={typeValue}>{voucherType_}</option>
      {typeValue === "percentage" && (
        <option value="nominal">Nominal</option>
      )}
      {typeValue === "nominal" && <option value="percentage">Persentase</option>}
    </select>
  );
};

export default ReplaceDiscountType;
