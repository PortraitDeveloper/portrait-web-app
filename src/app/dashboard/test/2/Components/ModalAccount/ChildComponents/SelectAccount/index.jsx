import { useEffect, useState } from "react";

const SelectAccount = ({getUserId}) => {
  const [credentialsData, setCredentialsData] = useState([]);

  useEffect(() => {
    getCredentialsData();
  }, []);

  const getCredentialsData = async () => {
    let response = await fetch("/api/credential", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setCredentialsData(response.data);
  };

  const changeHandler = (e) => {
    const userId = e.target.value;
    getUserId(userId)
  };

  return (
    <select
      className="border border-black rounded-xl px-3 py-2.5 w-72"
      name="selectAccount"
      id="selectAccount"
      required
      onChange={changeHandler}
    >
      {credentialsData.map((data, index) => (
        <option key={index} value={data.id}>
          {data.username}
        </option>
      ))}
    </select>
  );
};

export default SelectAccount;
