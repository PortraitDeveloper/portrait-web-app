"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: Session, status } = useSession();
  console.log(Session);

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "http://localhost:3000/" });
  };

  return (
    <div>
      <p>DashboardPage</p>
      <p>Hi {Session?.user.name}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 rounded-xl w-28 h-10"
        onClick={logoutHandler}
      >
        Sign out
      </button>
    </div>
  );
}
