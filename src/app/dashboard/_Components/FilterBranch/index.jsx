const FilterBranch = ({ branchesData, getBranchId }) => {
  const changeHandler = (e) => {
    const branchId = e.target.value;
    getBranchId(branchId);
  };

  return (
    <select
      className="px-3 py-2 rounded-xl border border-black text-sm font-sora w-48"
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

export default FilterBranch;
