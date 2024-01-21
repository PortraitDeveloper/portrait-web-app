/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const redirectUrl = process.env.NEXT_PUBLIC_HOME_URL;

  useEffect(() => {
    router.push(redirectUrl);
  }, []);
}
