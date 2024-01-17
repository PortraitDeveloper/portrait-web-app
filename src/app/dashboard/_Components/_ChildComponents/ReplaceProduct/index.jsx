/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const ReplaceProduct = ({ orderData, getProductName }) => {
  const [productName, setProductName] = useState("")
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProductName(orderData.products.product_name)
  }, []);

  useEffect(() => {
    getProductsData();
  }, []);

  const getProductsData = async () => {
    let response = await fetch(`/api/data/product/null/${orderData.products.branches.branch_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    let _products = response.data;

    _products = _products.filter(
      (item) => item.product_name !== orderData.products.product_name
    );

    setProducts(_products);
  };

  const changeHandler = (e) => {
    const productName = e.target.value;
    getProductName(productName);
  };

  return (
    <select
      name="selectProduct"
      id="selectProduct"
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-full"
      required
      onChange={changeHandler}
    >
      <option value={productName}>
        {productName}
      </option>
      {products.map((data, index) => (
        <option key={index} value={data.product_name}>
          {data.product_name}
        </option>
      ))}
    </select>
  );
};

export default ReplaceProduct;
