/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function TransactionPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.role !== "operator") {
      router.push("/dashboard/product");
    }
  }, [session]);

  return (
    <main className="bg-black flex flex-col justify-center items-center space-y-8 h-screen">
      <h1 className="text-white text-center text-2xl font-bold uppercase">
        This is Dashboard Transaction Page
      </h1>
      <button
        onClick={signOut}
        className="text-sm uppercase border text-white px-6 py-1.5 rounded-md hover:bg-white hover-text-black duration-400"
      >
        Log out
      </button>
    </main>
  );
}
