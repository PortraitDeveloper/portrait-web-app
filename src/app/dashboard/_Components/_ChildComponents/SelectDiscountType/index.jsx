const SelectDiscountType = ({ getDiscountType }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getDiscountType(value);
  };

  return (
    <select
      name="discountType"
      id="discountType"
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-full"
      required
      onChange={changeHandler}
    >
      <option value="percentage">Persentase</option>
      <option value="nominal">Nominal</option>
    </select>
  );
};

export default SelectDiscountType;
