import Image from "next/image";

const Intruction = ({ message }) => {
  return (
    <div className="border-[1.5px] border-blue-900 bg-blue-50 rounded-2xl py-2 px-2.5">
      <div className="flex justify-center items-center">
        <Image
          src="/exclamation.png"
          alt="Exclamation Icon"
          width={16}
          height={16}
        />
        <p className="text-blue-900 ml-2">{message}</p>
      </div>
    </div>
  );
};

export default Intruction;
