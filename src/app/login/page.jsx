"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPageTest() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const clearInputs = () => {
    setUsername("");
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    signIn("credentials", {
      username,
      password,
      redirect: false,
    })
      .then((res) => {
        if (res.error) {
          setError(JSON.parse(res.error).message);
          setLoading(false);
        } else {
          router.push("/access");
          clearInputs();
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleLogin}>
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
            onChange={handleUsernameChange}
            required
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
              className="bg-gray-100 outline-none"
              onChange={handlePasswordChange}
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
        </div>

        {/* Submit Button */}
        {!loading && (
          <div className="mb-2">
            <button
              className="bg-blue-900 text-sm text-white font-sora hover:bg-blue-700 rounded-xl h-11 w-80"
              type="submit"
            >
              Masuk
            </button>
          </div>
        )}

        {/* Process Submit */}
        {loading && (
          <div className="flex justify-center items-center bg-blue-900 text-sm text-center text-white font-sora hover:bg-blue-700 rounded-xl h-11 w-80 mb-2">
            Process...
          </div>
        )}

        {error && <p className="text-red-500 font-bold text-center">{error}</p>}
      </form>
    </div>
  );
}
