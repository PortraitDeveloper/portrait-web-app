"use client";
import Image from "next/image";
import Link from "next/link";

const SidebarContent = () => {
  return (
    <>
      {/* TPP LOGO */}
      <Image
        src="/portraitPlace2.png"
        alt="TPP Logo"
        width={120}
        height={120}
        className="mx-auto mb-6"
      />
      <ul className="mx-auto text-sm font-normal font-sora">
        <li>
          {/* LINK TO TRANSACTION PAGE */}
          <Link
            href="/dashboard/test/1"
            className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-32 h-10"
          >
            Transaction
          </Link>
        </li>
        <li>
          {/* LINK TO PRODUCT PAGE */}
          <Link
            href="/dashboard/test/2"
            className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-32 h-10"
          >
            Product
          </Link>
        </li>
        <li>
          {/* LINK TO ADDITIONAL PAGE */}
          <Link
            href="/dashboard/test/2"
            className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-32 h-10"
          >
            Additional
          </Link>
        </li>
        <li>
          {/* LINK TO VOUCHER PAGE */}
          <Link
            href="/dashboard/test/3"
            className="flex items-center justify-start pl-3 mb-3 rounded-2xl hover:bg-blue-900 hover:text-white w-32 h-10"
          >
            Voucher
          </Link>
        </li>
      </ul>
    </>
  );
};

export default SidebarContent;
