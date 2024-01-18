export default function calculateOrder(
  productPrice,
  personPrice,
  petPrice,
  print5rPrice,
  softfilePrice
) {
  const total =
    productPrice + personPrice + petPrice + print5rPrice + softfilePrice;
  return total;
}
