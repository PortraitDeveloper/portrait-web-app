const FilterBook = ({ getBookStatus }) => {
  const changeHandler = (e) => {
    const value = e.target.value;
    getBookStatus(value);
  };

  return (
    <select
      className="px-3 py-2 rounded-xl border border-black text-xs sm:text-sm font-sora w-full sm:w-48"
      onChange={changeHandler}
    >
      <option value="all">All Book Status</option>
      <option value="book">Book</option>
      <option value="rescheduled">Rescheduled</option>
      <option value="canceled">Canceled</option>
    </select>
  );
};

export default FilterBook;
