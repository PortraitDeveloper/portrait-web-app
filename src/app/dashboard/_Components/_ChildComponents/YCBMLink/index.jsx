import Link from "next/link";

const YCBMLink = ({ spesicURL }) => {
  return (
    <Link href={spesicURL} target="_blank">
      <div className="bg-blue-900 rounded-3xl px-3 py-2.5 w-full text-white text-center hover:bg-blue-700">
        Go to YCBM
      </div>
    </Link>
  );
};

export default YCBMLink;
