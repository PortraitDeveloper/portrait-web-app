/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import getTimeStamp from "@/utils/getTimeStamp";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Set redirect URL
const redirectUrl = "https://msha.ke/bookingstudio";

export default function Checkout() {
  // Read book ID parameter
  const searchParams = useSearchParams();
  const book_id = searchParams.get("book_id");

  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderBook, setOrderBook] = useState({
    book_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    branch_address: "",
    booking_start_date: "",
    booking_start_time: "",
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
    payment_url: "",
  });

  const paymentHandler = () => {
    setLoading(false);
    router.push(orderBook.payment_url);
  };

  const generateEmail = async (paymentUrl) => {
    try {
      const body = {
        email: orderBook.email,
        subject: "Link Pembayaran",
        text: `Hi ${orderBook.first_name},\nPesanan Anda dengan kode booking ${orderBook.book_code}\nTotal pembayaran Anda sebesar ${orderBook.total_paid_by_cust}\nBerikut adalah link pembayaran ${paymentUrl}.\nSegera lakukan pembayaran dalam waktu 15 menit kedepan, jika lewat batas waktu maka order booking anda akan dicancel secara otomatis.`,
      };

      const response = await fetch(`/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const log = {
          created_at: currentTimeStamp,
          route: "/checkout",
          message: "Something went wrong, email could not be sent.",
        };
        console.error(log);
      } else {
        setOrderBook({ payment_url: paymentUrl });
        setLoading(true);
      }
    } catch (error) {
      const log = {
        created_at: currentTimeStamp,
        route: "/checkout",
        message: error,
      };
      console.error(log);
    }
  };

  const generateTransaction = async () => {
    try {
      const body = {
        order_id: orderBook.book_code,
        gross_amount: orderBook.total_paid_by_cust,
        first_name: orderBook.first_name,
        last_name: orderBook.last_name,
        email: orderBook.email,
        phone: orderBook.phone,
      };

      const response = await fetch(`/api/payment/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const log = {
          created_at: currentTimeStamp,
          route: "/checkout",
          message: "Something went wrong, failed to fetch data to midtrans.",
        };
        console.error(log);
      } else {
        const payload = await response.json();
        const paymentUrl = payload.data.redirect_url;
        generateEmail(paymentUrl);
      }
    } catch (error) {
      const log = {
        created_at: currentTimeStamp,
        route: "/checkout",
        message: error,
      };
      console.error(log);
    }
  };

  const getData = (payload) => {
    const name = payload.data.customers.cust_name.split(" ");
    const firstName = name[0];
    const lastName = name[1];
    const dateObj = new Date(payload.data.booking_date);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthName = monthNames[monthIndex];
    const bookingStartDate = `${day} ${monthName} ${year}`;
    const bookingStartTime = payload.data.start_at;

    const voucherCode = payload.data.transactions.voucher_code
      ? payload.data.transactions.voucher_code
      : "-";
    const isVoucherApplied =
      voucherCode === "-"
        ? "Tidak menggunakan voucher"
        : payload.data.transactions.voucher_code
        ? "Voucher dapat digunakan"
        : "Voucher tidak dapat digunakan";

    setOrderBook({
      book_code: payload.data.book_code,
      first_name: firstName,
      last_name: lastName,
      email: payload.data.customers.email,
      phone_number: payload.data.customers.phone_number,
      branch_address: payload.data.products.branches.branch_address,
      booking_start_date: bookingStartDate,
      booking_start_time: bookingStartTime,
      product_name: payload.data.products.product_name,
      product_price: payload.data.products.product_price,
      additional_person_price:
        payload.data.transactions.additional_person_price,
      additional_pet_price: payload.data.transactions.additional_pet_price,
      additional_print5r_price:
        payload.data.transactions.additional_print5r_price,
      additional_softfile_price:
        payload.data.transactions.additional_softfile_price,
      total_price: payload.data.transactions.total_price,
      voucher_code: voucherCode,
      is_voucher_applied: isVoucherApplied,
      total_paid_by_cust: payload.data.transactions.total_paid_by_cust,
      payment_url: payload.data.transactions.payment_url,
    });
    generateTransaction();
  };

  // Create order book data and generate total price calculation
  const generateData = async (bookid) => {
    try {
      if (!bookid) {
        router.push(redirectUrl);
      } else {
        const response = await fetch(`/api/order/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookid }),
        });
        const payload = await response.json();

        if (
          payload.status === 404 &&
          payload.message === "Raw data not found."
        ) {
          router.push(redirectUrl);
        } else {
          if (
            payload.status === 200 &&
            payload.message === "Order book data already exists."
          ) {
            if (
              payload.data.book_status === "canceled" ||
              payload.data.transactions.payment_status === "cancel" ||
              payload.data.transactions.payment_status === "deny" ||
              payload.data.transactions.payment_status === "expire" ||
              payload.data.transactions.payment_status === "refund"
            ) {
              router.push(redirectUrl);
            } else {
              router.push(payload.data.transactions.payment_url);
            }
          } else {
            getData(payload);
          }
        }
      }
    } catch (error) {
      const log = {
        created_at: currentTimeStamp,
        route: "/checkout",
        status: 400,
        message: error,
      };
      console.error(log);
    }
  };

  useEffect(() => {
    generateData(book_id);
  }, [book_id]);

  return (
    <>
      {!loading && (
        <>
          <div className="flex items-center justify-center h-screen">
            <div>
              <div className="animate-spin mb-4">
                <img
                  src="/loadingCircle.png"
                  alt="loading circle"
                  width="75px"
                  heigh="50px"
                />
              </div>
              <text className="text-center font-bold">Loading...</text>
            </div>
          </div>
        </>
      )}
      {loading && (
        <div className="h-screen flex justify-center items-center">
          <div className="border border-black rounded-3xl px-6 py-4">
            <h1 className="text-center text-2xl font-bold">Ringkasan Order</h1>
            <div className="mt-4 mx-4">
              <p>Kode Booking : {orderBook.book_code}</p>
              <p>Lokasi : {orderBook.branch_address}</p>
              <p>Tanggal : {orderBook.booking_start_date}</p>
              <p>Pukul : {orderBook.booking_start_time} WIB</p>
            </div>
            <div className="flex justify-center item-center">
              <div className="mt-4 mx-4">
                <div className="flex">
                  <div className="w-64 py-1">{orderBook.product_name}</div>
                  <div className="py-1">{orderBook.product_price}</div>
                </div>
                <div className="flex">
                  <div className="w-64 py-1">Tambah Orang Dewasa</div>
                  <div className="py-1">
                    {orderBook.additional_person_price}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-64 py-1">Tambah Hewan Peliharaan</div>
                  <div className="py-1">{orderBook.additional_pet_price}</div>
                </div>
                <div className="flex">
                  <div className="w-64 py-1">Tambah Print5R</div>
                  <div className="py-1">
                    {orderBook.additional_print5r_price}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-64 py-1">Tambah Soft-File</div>
                  <div className="py-1">
                    {orderBook.additional_softfile_price}
                  </div>
                </div>
                <hr></hr>
                <div className="flex mb-3">
                  <div className="w-64 font-bold py-1">Total</div>
                  <div className="py-1 font-bold">{orderBook.total_price}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 mx-4">
              <p>Kode Voucher : {orderBook.voucher_code}</p>
              <p>Status Voucher : {orderBook.is_voucher_applied}</p>
            </div>
            <div className="flex justify-center item-center">
              <div className="mt-4 mx-4">
                <hr></hr>
                <div className="flex mb-3">
                  <div className="w-64 font-bold py-1">Total Pembayaran</div>
                  <div className="py-1 font-bold">
                    {orderBook.total_paid_by_cust}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl w-64 h-8 font-bold"
                onClick={paymentHandler}
              >
                Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
