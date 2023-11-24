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
  const host = process.env.NEXT_PUBLIC_HOST;
  const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY_DEV;
  const midtransUrl = process.env.NEXT_PUBLIC_MIDTRANS_URL_DEV;

  const searchParams = useSearchParams();
  const book_id = searchParams.get("book_id");
  console.log("Get BookID:", book_id);

  const [loading, setLoading] = useState(true);
  const [midtransToken, setMidtransToken] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
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

      const token = await response.json();
      console.log("token:", token);
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
        const body = {
          email: orderBook.email,
          subject: "Konfirmasi Pembayaran",
          text: `Hi ${orderBook.first_name},\nPembayaran Anda dengan kode booking ${orderBook.book_code} telah berhasil.`,
        };

        const response = await fetch(`${host}/api/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        console.log(response);

        if (!response.ok) {
          throw new Error(currentTimeStamp, "Email could not be sent");
        }

        router.push("/thankyou");
        setPaymentStatus(false);
      } catch (error) {
        console.error(currentTimeStamp, "Error sending email:", error);
      }
    };

    if (paymentStatus === true) {
      sendEmail();
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (midtransToken) {
      window.snap.pay(midtransToken, {
        onSuccess: (result) => {
          console.log(result);
          console.log("Payment successful");
          setPaymentStatus(true);
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

        if (!response.ok) {
          throw new Error(currentTimeStamp, "Failed to fetch data");
        }

        const data = await response.json();
        console.log("data:", data);

        const name = data.customers.cust_name.split(" ");
        const firstName = name[0];
        const lastName = name[1];
        console.log("First name:", firstName);
        console.log("Last Name:", lastName);

        const [bookingDate, timeWithMillis] = data.booking_start.split("T");
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

        const voucherCode = data.transactions.voucher_code
          ? data.transactions.voucher_code
          : "-";
        const isVoucherApplied =
          voucherCode === "-"
            ? "Tidak menggunakan voucher"
            : data.transactions.voucher_code
            ? "Voucher dapat digunakan"
            : "Voucher tidak dapat digunakan";

        setOrderBook({
          book_code: data.book_code,
          first_name: firstName,
          last_name: lastName,
          email: data.customers.email,
          phone_number: data.customers.phone_number,
          branch_address: data.products.branches.branch_address,
          booking_start_date: bookingStartDate,
          booking_start_time: bookingStartTime,
          product_name: data.products.product_name,
          product_price: data.products.product_price,
          additional_person_price: data.transactions.additional_person_price,
          additional_pet_price: data.transactions.additional_pet_price,
          additional_print5r_price: data.transactions.additional_print5r_price,
          additional_softfile_price:
            data.transactions.additional_softfile_price,
          total_price: data.transactions.total_price,
          voucher_code: voucherCode,
          is_voucher_applied: isVoucherApplied,
          total_paid_by_cust: data.transactions.total_paid_by_cust,
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getData(book_id);
  }, [book_id]); // Menambahkan book_id sebagai dependency agar efek berjalan saat nilai book_id berubah

  return (
    <>
      {loading ? (
        <p>loading...</p>
      ) : (
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
