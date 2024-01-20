const SelectAccount = ({ credentialsData, getUserId }) => {
  const changeHandler = (e) => {
    const userId = e.target.value;
    getUserId(userId);
  };

  return (
    <select
      className="border border-black rounded-3xl font-roboto px-3 py-2 w-72"
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
