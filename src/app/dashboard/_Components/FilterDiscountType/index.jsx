const FilterDiscountType = ({getDiscountType}) => {
  const changeHandler = (e) => {
    const discountType = e.target.value;
    getDiscountType(discountType);
  };

  return (
    <select
      className="px-3 py-2.5 rounded-xl border border-black text-sm font-sora w-34 mr-3"
      onChange={changeHandler}
    >
      <option value="percentage">Percentage</option>
      <option value="nominal">Nominal</option>
    </select>
  );
};

export default FilterDiscountType;
