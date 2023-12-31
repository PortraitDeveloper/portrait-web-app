const Filter = ({ branchesData, getBranchId }) => {
  const changeHandler = (e) => {
    const branchId = e.target.value;
    getBranchId(branchId);
  };

  return (
    <select
      name="filter"
      id="filter"
      className="px-3 py-2.5 rounded-xl border border-black text-sm font-sora w-48 mr-3"
      required
      onChange={changeHandler}
    >
      <option value="all">All Branches</option>
      {branchesData.map((data, index) => (
        <option key={index} value={data.branch_id}>
          {data.branch_name}
        </option>
      ))}
    </select>
  );
};

export default Filter;
