import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>NextAuth.js</h1>
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
    </main>
  );
}
