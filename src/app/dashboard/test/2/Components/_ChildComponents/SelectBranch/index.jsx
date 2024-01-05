"use client";
import { useEffect, useState } from "react";

const SelectBranch = ({ getBranchId }) => {
  const [branchData, setBranchData] = useState([]);

  const getData = async () => {
    let response = await fetch(`/api/data/branch`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setBranchData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const changeHandler = (e) => {
    const branchId = e.target.value;
    getBranchId(branchId);
  };

  return (
    <select
      name="filterBranch"
      id="filterBranch"
      className="border border-black rounded-3xl font-roboto px-3 py-2.5 w-72"
      required
      onChange={changeHandler}
    >
      <option value="null">Pilih Cabang</option>
      {branchData.map((data, index) => (
        <option key={index} value={data.branch_id}>
          {data.branch_name}
        </option>
      ))}
    </select>
  );
};

export default SelectBranch;
