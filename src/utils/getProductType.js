export default function getProductType(productName) {
  const product_type =
    productName.indexOf("Black and White") !== -1
      ? "Black and White"
      : productName.indexOf("Color") !== -1
      ? "Color"
      : "";
  return product_type;
}
