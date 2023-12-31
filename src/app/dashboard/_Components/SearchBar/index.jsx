import Image from "next/image";
import { useRef } from "react";

const Searchbar = ({ placeholder, getKeyword }) => {
  const inputRef = useRef(null);

  const submitHandler = () => {
    let keyword = inputRef.current.value;
    keyword = keyword === "" ? "null" : keyword;
    getKeyword(keyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  return (
    <div className="flex items-center border border-black rounded-xl pl-3 mr-5 w-full h-11">
      <Image
        src="/search.png"
        alt="Search Icon"
        width={24}
        height={24}
        className="mr-6 cursor-pointer"
        onClick={submitHandler}
      />
      <input
        type="text"
        id="search"
        name="search"
        placeholder={placeholder}
        className="outline-none w-full"
        ref={inputRef}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Searchbar;
