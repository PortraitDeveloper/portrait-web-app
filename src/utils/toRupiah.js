export default function toRupiah(value) {
  const rupiah = value
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    })
    .replace(",00", "");

  return rupiah;
}
