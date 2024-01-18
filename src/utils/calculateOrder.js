export default function calculateOrder(
  productPrice,
  personPrice,
  petPrice,
  print5rPrice,
  softfilePrice,
  voucherCode,
  vouchersData,
  prevTotal
) {
  const subTotal =
    productPrice + personPrice + petPrice + print5rPrice + softfilePrice;
  let total = 0;
  const voucher = vouchersData.find(
    (data) => data.voucher_code === voucherCode
  );

  if (!voucher) {
    const discount = 0;
    total = subTotal;
    const priceDiff = total - prevTotal;
    const result = {
      subTotal: subTotal,
      total: total,
      discount: discount,
      priceDiff: priceDiff,
    };

    return result;
  } else {
    if (voucher.percentage_discount) {
      // Calculate the total price with a percentage discount
      total = subTotal * (1.0 - voucher.percentage_discount);
    }
    if (voucher.nominal_discount) {
      // Calculate the total price with a nominal discount (if available)
      total =
        subTotal -
        (voucher.nominal_discount === null ? 0 : voucher.nominal_discount);
    }

    const discount = subTotal - total;
    const priceDiff = total - prevTotal;
    const result = {
      subTotal: subTotal,
      total: total,
      discount: discount,
      priceDiff: priceDiff,
    };

    return result;
  }
}
