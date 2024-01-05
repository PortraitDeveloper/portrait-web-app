import Image from "next/image";
import { useState } from "react";

const InputPassword = ({ placeHolder, getPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    getPassword(value);
  };

  return (
    <div className="flex justify-between items-center border border-black rounded-3xl px-3 py-2.5 w-72">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        placeholder={placeHolder}
        className="outline-none"
        onChange={changeHandler}
        required
      />
      <Image
        src="/mdiEye.png"
        width={24}
        height={24}
        alt="MDI Eye"
        className="rounded-full"
        onClick={togglePasswordVisibility}
      />
    </div>
  );
};

export default InputPassword;
