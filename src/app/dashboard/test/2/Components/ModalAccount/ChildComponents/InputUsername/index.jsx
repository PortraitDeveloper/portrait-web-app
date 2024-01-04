const InputUsername = ({ getUsername }) => {
  const changeHandler = (e) => {
    const username = e.target.value;
    getUsername(username);
  };

  return (
    <input
      type="text"
      id="username"
      name="username"
      placeholder="Ubah Username"
      outline="none"
      className="border border-black rounded-xl px-3 py-2.5 w-72"
      onChange={changeHandler}
      required
    />
  );
};

export default InputUsername;
