export default function dataConvertion(payload) {
  // Name convertion
  const name = payload.data.customers.cust_name.split(" ");
  const first_name = name[0];
  const last_name = name[1];

  // Booking date convertion
  const dateObj = new Date(payload.data.booking_date);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthName = monthNames[monthIndex];
  const booking_date = `${day} ${monthName} ${year}`;

  // Product name convertion
  const productNameArray = payload.data.products.product_name.split("(");
  const product_name = productNameArray[0];

  // Generate product type
  const product_type =
    payload.data.products.product_name.indexOf("Black and White") !== -1
      ? "Black and White"
      : payload.data.products.product_name.indexOf("Color") !== -1
      ? "Color"
      : "";

  // Number of add person convertion
  const number_of_add_person = payload.data.number_of_add_person
    .toString()
    .concat("x");

  // Number of add pet convertion
  const number_of_add_pet = payload.data.number_of_add_pet
    .toString()
    .concat("x");

  // Number of add print5R convertion
  const number_of_add_print5r = payload.data.number_of_add_print5r
    .toString()
    .concat("x");

  // Number of add soft-file convertion
  const number_of_add_softfile = payload.data.is_add_softfile ? "1x" : "0x";

  // Voucher code convertion
  const voucher_code = payload.data.transactions.voucher_code
    ? payload.data.transactions.voucher_code
    : "-";

  // Generate discount
  let discount =
    voucher_code === "-"
      ? 0
      : payload.data.transactions.total_paid_by_cust -
        payload.data.transactions.total_price;

  // Discount convertion
  discount = discount
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  // Product price convertion
  const product_price = payload.data.products.product_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Additional person price convertion
  const additional_person_price =
    payload.data.transactions.additional_person_price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(",00", "");

  // Additional pet price convertion
  const additional_pet_price = payload.data.transactions.additional_pet_price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  // Additional print5R price convertion
  const additional_print5r_price =
    payload.data.transactions.additional_print5r_price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(",00", "");

  // Additional soft-file price convertion
  const additional_softfile_price =
    payload.data.transactions.additional_softfile_price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(",00", "");

  // Total price convertion
  const total_price = payload.data.transactions.total_price
    .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    .replace(",00", "");

  // Total paid by cust convertion
  const total_paid_by_cust = payload.data.transactions.total_paid_by_cust
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
