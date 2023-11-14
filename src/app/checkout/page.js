"use client";
import { useSearchParams } from "next/navigation";

async function getData(book_id) {
  const res = await fetch(`http://localhost:3000/api/orderbook/${book_id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Checkout() {
  const searchParams = useSearchParams();
  const book_id = searchParams.get("book_id");
  const orderBook = getData(book_id);

  return (
    <>
      <h1>Checkout Page</h1>
      <p>{book_id}</p>
      <p>{orderBook}</p>
    </>
  );
}
