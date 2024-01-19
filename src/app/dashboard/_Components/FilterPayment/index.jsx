const FilterPayment = ({ getPaymentStatus }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getPaymentStatus(value);
  };

  return (
    <select
      className="px-3 py-2 rounded-xl border border-black text-xs sm:text-sm font-sora w-full sm:w-48"
      onChange={changeHandler}
    >
      <option value="all">All Payment Status</option>
      <option value="paid">Paid</option>
      <option value="unpaid">Unpaid</option>
      <option value="pending">Pending</option>
      <option value="refund">Refund</option>
      <option value="partial_refund">Partial Refund</option>
    </select>
  );
};

export default FilterPayment;
