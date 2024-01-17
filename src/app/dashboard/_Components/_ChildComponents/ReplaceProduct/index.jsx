/* eslint-disable react-hooks/exhaustive-deps */
const ReplaceProduct = ({ orderData, productsData, getSelectedProduct }) => {
  const filteredProducts = productsData.filter(
    (item) =>
      item.product_name !== orderData.products.product_name &&
      item.branch_id === orderData.products.branch_id &&
      item.product_price === orderData.products.product_price
  );

  const changeHandler = (e) => {
    const productId = e.target.value;
    const productFiltered = productsData.filter(
      (item) => item.product_id === productId
    );
    const productSelected = {
      product_id: productFiltered[0].product_id,
      product_name: productFiltered[0].product_name,
      product_price: productFiltered[0].product_price,
    };
    getSelectedProduct(productSelected);
  };

  return (
    <select
      name="selectProduct"
      id="selectProduct"
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-full"
      required
      onChange={changeHandler}
    >
      <option value={orderData.products.product_id}>
        {orderData.products.product_name}
      </option>
      {filteredProducts.map((data, index) => (
        <option key={index} value={data.product_id}>
          {data.product_name}
        </option>
      ))}
    </select>
  );
};

export default ReplaceProduct;
