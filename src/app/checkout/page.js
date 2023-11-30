/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import getTimeStamp from "@/utils/getTimeStamp";
import { useRouter } from "next/navigation";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;
// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export default function Checkout() {
  const router = useRouter();
  const timeOut = 3000;
  const redirectUrl = "https://msha.ke/bookingstudio";
  const host = process.env.NEXT_PUBLIC_HOST;
  const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY_DEV;
  const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_URL_DEV;
  const searchParams = useSearchParams();
  const book_id = searchParams.get("book_id");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(false);

  const [midtransToken, setMidtransToken] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

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
  });

  const clickHandler = async () => {
    try {
      const body = {
        order_id: orderBook.book_code,
        gross_amount: orderBook.total_paid_by_cust,
        first_name: orderBook.first_name,
        last_name: orderBook.last_name,
        email: orderBook.email,
        phone: orderBook.phone,
      };

      const response = await fetch(`${host}/api/payment/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(currentTimeStamp, "Failed to fetch data to midtrans");
      }

      const transaction = await response.json();
      const paymentUrl = transaction.paymentUrl;
      const token = transaction.token;
      console.log("token:", token);
      console.log("paymentUrl:", paymentUrl);

      setPaymentUrl(paymentUrl);
      setMidtransToken(token);
    } catch (error) {
      console.error(
        currentTimeStamp,
        "Error during payment at midtrans:",
        error.message
      );
    }
  };

  useEffect(() => {
    const sendEmail = async () => {
      try {
        const payload = {
          email: orderBook.email,
          subject: "Link Pembayaran",
          text: `Hi ${orderBook.first_name},\nPesanan Anda dengan kode booking ${orderBook.book_code} \nBerikut adalah link pembayaran ${paymentUrl}. \nSegera lakukan pembayaran dalam waktu 15 menit kedepan, jika lewat batas waktu maka order booking anda akan dicancel secara otomatis.`,
        };

        const response = await fetch(`${host}/api/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("Email Response:", response);

        if (!response.ok) {
          throw new Error(currentTimeStamp, "Email could not be sent");
        }
      } catch (error) {
        console.error(currentTimeStamp, "Error sending email:", error);
      }
    };

    if (midtransToken) {
      sendEmail();
      window.snap.pay(midtransToken, {
        onSuccess: (result) => {
          console.log(result);
          console.log("Payment successful");
          setMidtransToken("");
        },
        onPending: (result) => {
          console.log(result);
          console.log("pending payment");
          setMidtransToken("");
        },
        onError: (error) => {
          console.log(error);
          console.log("Payment failed");
          setMidtransToken("");
        },
        onClose: () => {
          console.log("Payment Completed");
          setMidtransToken("");
        },
      });
    }
  }, [midtransToken]);

  useEffect(() => {
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    scriptTag.setAttribute("data-client-key", clientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  useEffect(() => {
    const getData = async (bookid) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, timeOut));
        const response = await fetch(`${host}/api/data/book/${bookid}`);
        const payload = await response.json();
        console.log("payload:", payload);

        if (payload.status === 404) {
          router.push(redirectUrl);
        } else {
          const name = payload.data.customers.cust_name.split(" ");
          const firstName = name[0];
          const lastName = name[1];
          const [bookingDate, timeWithMillis] =
            payload.data.booking_start.split("T");
          const dateObj = new Date(bookingDate);
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
          const bookingStartTime = timeWithMillis.replace(":00.000Z", "");

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
            additional_pet_price:
              payload.data.transactions.additional_pet_price,
            additional_print5r_price:
              payload.data.transactions.additional_print5r_price,
            additional_softfile_price:
              payload.data.transactions.additional_softfile_price,
            total_price: payload.data.transactions.total_price,
            voucher_code: voucherCode,
            is_voucher_applied: isVoucherApplied,
            total_paid_by_cust: payload.data.transactions.total_paid_by_cust,
          });

          setView(true);
        }
      } catch (error) {
        const log = {
          created_at: currentTimeStamp,
          route: "/checkout",
          status: 400,
          message: error,
        };
        errorLog(log);
        console.error(log);
      } finally {
        setLoading(false);
      }
    };

    getData(book_id);
  }, []);

  return (
    <>
      {loading && !view && <p>loading...</p>}
      {!loading && view && (
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
                onClick={clickHandler}
              >
                Pilih Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
