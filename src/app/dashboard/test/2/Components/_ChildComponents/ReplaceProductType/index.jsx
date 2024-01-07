/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceProductType = ({ productType, getProductType }) => {
  const [productType_, setProductType_] = useState("");
  const [productValue_, setProductValue_] = useState("");

  useEffect(() => {
    const _productType =
      productType === "(Black and White)"
        ? "Hitam Putih"
        : productType === "(Color)"
        ? "Berwarna"
        : "Tanpa Keterangan";
    const _productValue = productType === "(" ? "" : productType;

    setProductType_(_productType);
    setProductValue_(_productValue);
    getProductType(_productValue);
  }, []);

  const changeHandler = (e) => {
    const value = e.target.value;
    getProductType(value);
  };

  return (
    <select
      name="productType"
      id="productType"
      className="border border-black rounded-3xl font-roboto px-3 py-2.5 w-72"
      required
      onChange={changeHandler}
    >
      <option value={productValue_}>{productType_}</option>
      {productType !== "(Black and White)" && (
        <option value="(Black and White)">Hitam Putih</option>
      )}
      {productType !== "(Color)" && <option value="(Color)">Berwarna</option>}
      {productType !== "(" && <option value="">Tanpa Keterangan</option>}
    </select>
  );
};

export default ReplaceProductType;
