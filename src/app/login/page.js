"use client";
import Image from "next/image";
import { useState } from "react";

export default function LoginPageTest() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="flex justify-center items-center">
          <Image
            src="/portraitPlacePortal.png"
            width={200}
            height={240}
            alt="The Portrait Place Logo"
            className="mb-6"
          />
        </div>

        <div className="mb-3">
          <p>Username</p>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Masukan Username"
            outline="none"
            className="bg-gray-100 outline-none rounded-2xl pl-4 h-11 w-80"
            required
            // onChange={changeHandler}
          />
        </div>

        <div className="mb-6">
          <p>Password</p>
          <div className="bg-gray-100 rounded-2xl flex justify-between items-center px-4 py-2 h-11 w-80">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Masukkan Password"
              required
              className="bg-gray-100 outline-none"
              // onChange={changeHandler}
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
        </div>

        {/* Submit Button */}
        <div>
          <button
            className="bg-blue-900 text-sm text-white font-sora hover:bg-blue-700 rounded-xl h-11 w-80"
            // onClick={getHandleTransaction}
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
