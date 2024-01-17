const SelectProductType = ({ getProductType }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getProductType(value);
  };

  return (
    <select
      name="productType"
      id="productType"
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-72"
      required
      onChange={changeHandler}
    >
      <option value="(Black and White)">Hitam Putih</option>
      <option value="(Color)">Berwarna</option>
      <option value="">Tanpa Keterangan</option>
    </select>
  );
};

export default SelectProductType;
