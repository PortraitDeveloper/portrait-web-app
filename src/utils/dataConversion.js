import dateConversion from "./dateConversion";

export default function dataConversion(payload) {
  // Name convertion
  const name = payload.customers.cust_name.split(" ");
  const first_name = name[0];
  const last_name = name[1];

  // Booking date convertion
  const booking_date = dateConversion(payload.booking_date);

  // Product name convertion
  const productNameArray = payload.products.product_name.split("(");
  const product_name = productNameArray[0];

  // Generate product type
  const product_type =
    payload.products.product_name.indexOf("Black and White") !== -1
      ? "Black and White"
      : payload.products.product_name.indexOf("Color") !== -1
      ? "Color"
      : "";

  // Number of add person convertion
  const number_of_add_person = payload.number_of_add_person
    .toString()
    .concat("x");

  // Number of add pet convertion
  const number_of_add_pet = payload.number_of_add_pet.toString().concat("x");

  // Number of add print5R convertion
  const number_of_add_print5r = payload.number_of_add_print5r
    .toString()
    .concat("x");

  // Number of add soft-file convertion
  const number_of_add_softfile = payload.is_add_softfile ? "1x" : "0x";

  // Voucher code convertion
  const voucher_code = payload.transactions.voucher_code
    ? payload.transactions.voucher_code
    : "-";

  // Generate discount
  let discount =
    voucher_code === "-"
      ? 0
      : payload.transactions.total_paid_by_cust -
        payload.transactions.total_price;

  // Discount convertion
  discount = discount
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  // Product price convertion
  const product_price = payload.products.product_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Additional person price convertion
  const additional_person_price = payload.transactions.additional_person_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Additional pet price convertion
  const additional_pet_price = payload.transactions.additional_pet_price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  // Additional print5R price convertion
  const additional_print5r_price = payload.transactions.additional_print5r_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Additional soft-file price convertion
  const additional_softfile_price =
    payload.transactions.additional_softfile_price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(",00", "");

  // Total price convertion
  const total_price = payload.transactions.total_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Total paid by cust convertion
  const total_paid_by_cust = payload.transactions.total_paid_by_cust
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  const convertion = {
    first_name,
    last_name,
    booking_date,
    product_name,
    product_type,
    number_of_add_person,
    number_of_add_pet,
    number_of_add_print5r,
    number_of_add_softfile,
    voucher_code,
    discount,
    product_price,
    additional_person_price,
    additional_pet_price,
    additional_print5r_price,
    additional_softfile_price,
    total_price,
    total_paid_by_cust,
  };

  return convertion;
}
