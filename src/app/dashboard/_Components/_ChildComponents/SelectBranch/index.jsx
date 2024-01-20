const SelectBranch = ({ branchesData, getBranchId }) => {
  const changeHandler = (e) => {
    const branchId = e.target.value;
    getBranchId(branchId);
  };

  return (
    <select
      name="filterBranch"
      id="filterBranch"
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-72"
      required
      onChange={changeHandler}
    >
      <option value="null">Pilih Cabang</option>
      {branchesData.map((data, index) => (
        <option key={index} value={data.branch_id}>
          {data.branch_name}
        </option>
      ))}
    </select>
  );
};

export default SelectBranch;
