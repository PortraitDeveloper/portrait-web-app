"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [view, setView] = useState("orders_book");
  const [ordersBook, setOrdersBook] = useState([]);

  const getOrdersBookData = async () => {
    const response = await fetch(`/api/data/book`);
    const payload = await response.json();
    setOrdersBook(payload.data);
  };

  useEffect(() => {
    switch (view) {
      case "products":
        console.log("Get Products Data");
        break;
      case "additionals":
        console.log("Get Additionals Data");
        break;
      case "vouchers":
        console.log("Get Vouchers Data");
        break;
      default:
        getOrdersBookData();
    }
  }, [view]);

  return (
    <>
      <div className="navbar bg-blue-700 text-white">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl font-bold">The Portrait Place</a>
        </div>
        {/* <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="text-xl">Logout</a>
            </li>
          </ul>
        </div> */}
      </div>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-50 min-h-full bg-slate-200 text-lg font-bold text-base-content">
            {/* Sidebar content here */}
            <li>
              <a
                onClick={(e) => {
                  setView("orders_book");
                }}
              >
                Orders Book
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  setView("transactions");
                }}
              >
                Transactions
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  setView("payment_status");
                }}
              >
                Payment Status
              </a>
            </li>

            <li>
              <a
                onClick={(e) => {
                  setView("products");
                }}
              >
                Products
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  setView("additionals");
                }}
              >
                Additionals
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  setView("vouchers");
                }}
              >
                Vouchers
              </a>
            </li>
          </ul>
        </div>
        <div className="drawer-content">
          {/* Page content here */}
          {view === "orders_book" && (
            <div className="text-sm">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-center p-1 border-b border-slate-300">
                      Kode Booking
                    </th>
                    <th className="text-center p-1 border-b border-slate-300">
                      Cabang
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Tanggal Booking
                    </th>
                    <th className="text-center p-1 border-b border-slate-300">
                      Jam Booking
                    </th>
                    <th className="text-center p-1 border-b border-slate-300">
                      Paket
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Nama Customer
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      No HP/WA
                    </th>
                    <th className="text-center hidden lg:table-cell p-1 border-b border-slate-300">
                      Status Booking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersBook.map((orderBook, index) => (
                    <tr key={index}>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.book_code}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.products.branches.branch_name}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.booking_date}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.start_at}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.products.product_name}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.customers.cust_name}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.customers.phone_number}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.book_status}
                      </td>
                      <td className="p-1 border-b border-slate-300">
                        <div className="flex justify-center">
                          <button className="bg-blue-500 text-white text-xs w-12 h-5 rounded-lg hover:bg-blue-700">
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {view === "transactions" && (
            <div className="text-sm">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-center p-1 border-b border-slate-300">
                      Kode Booking
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Harga Paket
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Tambahan Orang
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Tambahan Hewan
                    </th>
                    <th className="text-center hidden lg:table-cell p-1 border-b border-slate-300">
                      Tambahan Print5R
                    </th>
                    <th className="text-center hidden lg:table-cell p-1 border-b border-slate-300">
                      Tambahan Softfile
                    </th>
                    <th className="text-center hidden lg:table-cell p-1 border-b border-slate-300">
                      Total Sebelum Diskon
                    </th>
                    <th className="text-center hidden lg:table-cell p-1 border-b border-slate-300">
                      Total Setelah Diskon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersBook.map((orderBook, index) => (
                    <tr key={index}>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.book_code}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.product_price}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.transactions.additional_person_price}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.additional_pet_price}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.additional_print5r_price}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.transactions.additional_softfile_price}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.total_price}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.total_paid_by_cust}
                      </td>
                      <td className="p-1 border-b border-slate-300">
                        <div className="flex justify-center">
                          <button className="bg-blue-500 text-white text-xs w-12 h-5 rounded-lg hover:bg-blue-700">
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {view === "payment_status" && (
            <div className="text-sm">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-center p-1 border-b border-slate-300">
                      Kode Booking
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Status Pembayaran
                    </th>
                    <th className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                      Link Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersBook.map((orderBook, index) => (
                    <tr key={index}>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.book_code}
                      </td>
                      <td className="text-center hidden sm:table-cell p-1 border-b border-slate-300">
                        {orderBook.transactions.payment_status}
                      </td>
                      <td className="text-center p-1 border-b border-slate-300">
                        {orderBook.transactions.payment_url}
                      </td>
                      <td className="p-1 border-b border-slate-300">
                        <div className="flex justify-center">
                          <button className="bg-red-500 text-white text-xs w-12 h-5 rounded-lg hover:bg-blue-700">
                            Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {view === "products" && <h1>Data coming soon...</h1>}
          {view === "additionals" && <h1>Data coming soon...</h1>}
          {view === "vouchers" && <h1>Data coming soon...</h1>}
        </div>
      </div>
    </>
  );
}
