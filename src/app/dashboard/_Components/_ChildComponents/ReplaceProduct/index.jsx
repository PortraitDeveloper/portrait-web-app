import getProductType from "@/utils/getProductType";

const ReplaceProduct = ({
  productBid,
  productId,
  productName,
  productsData,
  getSelectedProduct,
}) => {
  const filteredProducts = productsData.filter(
    (item) => item.branch_id === productBid
  );

  const changeHandler = (e) => {
    const productId = e.target.value;
    const productFiltered = productsData.filter(
      (item) => item.product_id === productId
    );
    const productName = productFiltered[0].product_name;
    const productType = getProductType(productName);
    const productSelected = {
      product_id: productFiltered[0].product_id,
      branch_id: productFiltered[0].branch_id,
      product_name: productName,
      product_type: productType,
      product_price: productFiltered[0].product_price,
    };
    getSelectedProduct(productSelected);
  };

  return (
    <select
      name="selectProduct"
      id="selectProduct"
      className="border border-black rounded-xl font-roboto px-3 py-2 w-full"
      required
      onChange={changeHandler}
    >
      <option value={productId}>{productName}</option>
      {filteredProducts.map((data, index) => (
        <option key={index} value={data.product_id}>
          {data.product_name}
        </option>
      ))}
    </select>
  );
};

export default ReplaceProduct;
