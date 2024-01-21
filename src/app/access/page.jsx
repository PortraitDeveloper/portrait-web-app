/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccessPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const role = session?.user.role;
    if (role !== "operator") {
      router.push("/dashboard/backoffice/transaction");
    } else if (role !== "backoffice") {
      router.push("/dashboard/operator/transaction");
    } else {
      router.push("/");
    }
  }, [session]);
}
