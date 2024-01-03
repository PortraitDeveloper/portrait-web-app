import Image from "next/image";

const Searchbar = ({ placeholder }) => {
  return (
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
        placeholder={placeholder}
        className="outline-none w-full"
        // onChange={handleUsernameChange}
      />
    </div>
  );
};

export default Searchbar;
