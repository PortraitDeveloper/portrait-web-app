import Image from "next/image";
import { useState } from "react";

const InputPassword = ({ placeHolder, getPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changeHandler = (e) => {
    const password = e.target.value;
    getPassword(password);
  };

  return (
    <div className="flex justify-between items-center border border-black rounded-xl px-3 py-2.5 w-72">
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
