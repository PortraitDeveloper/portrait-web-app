const FilterDiscountType = ({getDiscountType}) => {
  const changeHandler = (e) => {
    const discountType = e.target.value;
    getDiscountType(discountType);
  };

  return (
    <select
      className="px-3 py-2.5 rounded-xl border border-black text-sm font-sora w-48 mr-3"
      onChange={changeHandler}
    >
      <option value="percentage">Percentage Discount</option>
      <option value="nominal">Nominal Discount</option>
    </select>
  );
};

export default FilterDiscountType;
