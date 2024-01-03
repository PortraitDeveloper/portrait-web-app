"use client";
import { useEffect, useState } from "react";

const Filter = ({ getBranchId }) => {
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
      name="filter"
      id="filter"
      className="px-3 py-2.5 rounded-xl border border-black text-sm font-sora w-48 mr-3"
      required
      onChange={changeHandler}
    >
      <option value="all">All Branches</option>
      {branchData.map((data, index) => (
        <option key={index} value={data.branch_id}>
          {data.branch_name}
        </option>
      ))}
    </select>
  );
};

export default Filter;
