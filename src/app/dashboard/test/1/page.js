import Image from "next/image";
import Link from "next/link";

export default function BackofficePage() {
  return (
    <>
      <div className="flex justify-center items-center">
        {/* SIDEBAR */}
        <div className="shadow-xl shadow-gray-400 h-screen">
          <div className="p-6">
            <Image
              src="/portraitPlace2.png"
              alt="TPP Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <ul className="mx-auto text-sm font-normal font-sora">
              <li className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-47 h-10">
                <Link href="/dashboard/test/1">Transaction</Link>
              </li>
              <li className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-47 h-10">
                <Link href="/dashboard/test/2">Product & Additional</Link>
              </li>
              <li className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-47 h-10">
                <Link href="/dashboard/test/3">Voucher</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-full h-screen px-6 pt-2">
          {/* SEARCH */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center border border-black rounded-xl pl-3 mr-5 w-full h-11">
              <Image
                src="/search.png"
                alt="Logout Icon"
                width={24}
                height={24}
                className="mr-6"
              />
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Find Product by Name"
                className="outline-none"
                // onChange={handleUsernameChange}
              />
            </div>

            {/* ACCOUNT SETTING & LOGOUT */}
            <div className="flex justify-center items-center border border-black rounded-xl w-11 h-11">
              <Image
                src="/logout.png"
                alt="Logout Icon"
                width={24}
                height={24}
              />
              {/* <select name="user" id="user">
                <option value="Account Setting">Account Setting</option>
                <option value="Sign Out">Sign Out</option>
              </select> */}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div>Data coming soon...</div>
          </div>
        </div>
      </div>
    </>
  );
}
