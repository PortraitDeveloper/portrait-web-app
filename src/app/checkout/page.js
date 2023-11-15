/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Checkout() {
  const searchParams = useSearchParams();
  const book_id = searchParams.get("book_id");
  const [orderBook, setOrderBook] = useState({
    cust_name: "",
    book_code: "",
    branch_name: "",
    booking_start: "",
    product_name: "",
    product_price: "",
    additional_person_price: "",
    additional_pet_price: "",
    additional_print5r_price: "",
    additional_softfile_price: "",
    total_price: "",
    voucher_code: "",
    is_voucher_applied: "",
    total_paid_by_cust: "",
  });

  useEffect(() => {
    const getData = async (bookid) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/data/book/${bookid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    getData(book_id);
  }, [book_id]); // Menambahkan book_id sebagai dependency agar efek berjalan saat nilai book_id berubah

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="border border-black rounded-3xl px-6 py-4">
          <h1 className="text-center text-2xl font-bold">Ringkasan Order</h1>
          <div className="mt-4 mx-4">
            <p>Kode Booking : TEST</p>
            <p>Tanggal Booking : TEST</p>
          </div>
          <div className="flex justify-center item-center">
            <div className="mt-4 mx-4">
              <div className="flex">
                <div className="w-64 py-1">
                  Portrait Shoot With White Background (black&white)
                </div>
                <div className="py-1">TEST</div>
              </div>
              <div className="flex">
                <div className="w-64 py-1">Tambah Orang Dewasa</div>
                <div className="py-1">TEST</div>
              </div>
              <div className="flex">
                <div className="w-64 py-1">Tambah Hewan Peliharaan</div>
                <div className="py-1">TEST</div>
              </div>
              <div className="flex">
                <div className="w-64 py-1">Tambah Print5R</div>
                <div className="py-1">TEST</div>
              </div>
              <div className="flex">
                <div className="w-64 py-1">Tambah Soft-File</div>
                <div className="py-1">TEST</div>
              </div>
              <hr></hr>
              <div className="flex mb-3">
                <div className="w-64 font-bold py-1">Total</div>
                <div className="py-1 font-bold">TEST</div>
              </div>
            </div>
          </div>
          <div className="mt-4 mx-4">
            <p>Kode Voucher : TEST</p>
            <p>Status Voucher : TEST</p>
          </div>
          <div className="flex justify-center item-center">
            <div className="mt-4 mx-4">
              <hr></hr>
              <div className="flex mb-3">
                <div className="w-64 font-bold py-1">Total Pembayaran</div>
                <div className="py-1 font-bold">TEST</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mt-4">
            <button className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl w-64 h-8 font-bold">
              Pilih Pembayaran
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
