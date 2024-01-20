import Image from "next/image";
import Link from "next/link";

const SidebarContent = ({ pageTitle, role }) => {
  const links = [
    { href: "/dashboard/backoffice/transaction", label: "Transaction" },
    { href: "/dashboard/backoffice/product", label: "Product" },
    { href: "/dashboard/backoffice/additional", label: "Add-ons" },
    { href: "/dashboard/backoffice/voucher", label: "Voucher" },
  ];

  return (
    <>
      <Image
        src="/portraitPlace2.png"
        alt="TPP Logo"
        width={120}
        height={120}
        className="mx-auto mb-6"
      />

      {role === "operator" && (<div className="w-32"></div>)}

      {role === "backoffice" && (
        <ul className="mx-auto text-sm font-normal font-sora">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`flex items-center justify-start pl-3 mb-3 rounded-2xl ${
                  pageTitle === link.label
                    ? "bg-blue-900 text-white"
                    : "hover:font-bold"
                } w-32 h-10`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SidebarContent;
