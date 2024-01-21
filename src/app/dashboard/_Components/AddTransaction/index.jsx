import Link from "next/link";
const url = process.env.NEXT_PUBLIC_HOME_URL;

const AddTransaction = () => {
  return (
    <div className="px-3 py-2 bg-blue-900 rounded-xl text-sm text-white font-sora hover:bg-blue-700">
      <Link href={url} target="_blank">
        Add Transaction +
      </Link>
    </div>
  );
};

export default AddTransaction;
