/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import getTimeStamp from "@/utils/getTimeStamp";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Set timeout 15 minute
const timeOut = 15;

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
    booking_date: "",
    start_at: "",
    product_name: "",
    product_type: "",
    product_price: "",
    number_of_add_person: "",
    additional_person_price: "",
    number_of_add_pet: "",
    additional_pet_price: "",
    number_of_add_print5r: "",
    additional_print5r_price: "",
    number_of_add_softfile: "",
    additional_softfile_price: "",
    total_price: "",
    voucher_code: "",
    discount: "",
    total_paid_by_cust: "",
  });

  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Subtracts the time every second
      setCountdown((prevCountdown) => {
        const newSeconds = prevCountdown.seconds - 1;
        const newMinutes =
          newSeconds < 0 ? prevCountdown.minutes - 1 : prevCountdown.minutes;
        const seconds = newSeconds < 0 ? 59 : newSeconds;

        // If time out, redirect page
        if (newMinutes === 0 && seconds === 0) {
          clearInterval(intervalId);
          router.push(redirectUrl);
        }

        return {
          minutes: newMinutes,
          seconds: seconds,
        };
      });
    }, 1000);

    // Clear interval when the component is no longer used
    return () => clearInterval(intervalId);
  }, []);

  const generateEmail = async (paymentUrl) => {
    try {
      const body = {
        email: orderBook.email,
        subject: "Link Pembayaran",
        text: `Hi ${orderBook.first_name},\nPesanan Anda dengan kode booking ${orderBook.book_code}\nBerikut adalah link pembayaran ${paymentUrl}.\nSegera lakukan pembayaran dalam waktu 15 menit kedepan, jika lewat batas waktu maka order booking anda akan dicancel secara otomatis.`,
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
        router.push(paymentUrl);
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
    setLoading(false);
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
    const createdAt = payload.data.created_at;
    const dateObject = new Date(createdAt);

    // Define deadline
    dateObject.setMinutes(dateObject.getMinutes() + timeOut);
    const deadLine = dateObject.toISOString();

    // Calculate and setup minutes and second for countdown
    const timeDifference = dateObject - currentTimeStamp;
    const minutesCountdown = Math.floor(timeDifference / (1000 * 60));
    const secondsCountdown = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // If timeout then redirect page
    if (minutesCountdown <= 0) {
      router.push(redirectUrl);
    } else {
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

      const productNameArray = payload.data.products.product_name.split("(");
      const productName = productNameArray[0];

      const productType =
        payload.data.products.product_name.indexOf("Black and White") !== -1
          ? "Black and White"
          : payload.data.products.product_name.indexOf("Color") !== -1
          ? "Color"
          : "";

      const numberOfAddPerson = payload.data.number_of_add_person
        .toString()
        .concat("x");
      const numberOfAddPet = payload.data.number_of_add_pet
        .toString()
        .concat("x");
      const numberOfAddPrint5r = payload.data.number_of_add_print5r
        .toString()
        .concat("x");
      const numberOfAddSoftfile = payload.data.is_add_softfile ? "1x" : "0x";

      const voucherCode = payload.data.transactions.voucher_code
        ? payload.data.transactions.voucher_code
        : "-";

      let discount =
        voucherCode === "-"
          ? 0
          : payload.data.transactions.total_paid_by_cust -
            payload.data.transactions.total_price;

      discount = discount
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "");

      const productPrice = payload.data.products.product_price
        .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
        .replace(",00", "");

      const additionalPersonPrice =
        payload.data.transactions.additional_person_price
          .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
          .replace(",00", "");

      const additionalPetPrice = payload.data.transactions.additional_pet_price
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "");

      const additionalPrint5rPrice =
        payload.data.transactions.additional_print5r_price
          .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
          .replace(",00", "");

      const additionalSoftfilePrice =
        payload.data.transactions.additional_softfile_price
          .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
          .replace(",00", "");

      const totalPrice = payload.data.transactions.total_price
        .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
        .replace(",00", "");

      const totalPaidByCust = payload.data.transactions.total_paid_by_cust
        .toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })
        .replace(",00", "");

      setOrderBook({
        book_code: payload.data.book_code,
        first_name: firstName,
        last_name: lastName,
        email: payload.data.customers.email,
        phone_number: payload.data.customers.phone_number,
        branch_address: payload.data.products.branches.branch_address,
        booking_date: bookingStartDate,
        start_at: bookingStartTime,
        product_name: productName,
        product_type: productType,
        product_price: productPrice,
        number_of_add_person: numberOfAddPerson,
        additional_person_price: additionalPersonPrice,
        number_of_add_pet: numberOfAddPet,
        additional_pet_price: additionalPetPrice,
        number_of_add_print5r: numberOfAddPrint5r,
        additional_print5r_price: additionalPrint5rPrice,
        number_of_add_softfile: numberOfAddSoftfile,
        additional_softfile_price: additionalSoftfilePrice,
        total_price: totalPrice,
        voucher_code: voucherCode,
        discount: discount,
        total_paid_by_cust: totalPaidByCust,
      });

      setCountdown({
        minutes: minutesCountdown,
        seconds: secondsCountdown,
      });

      setLoading(true);
    }
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
              payload.data.transactions.payment_status === "expire"
            ) {
              router.push(redirectUrl);
            } else {
              if (payload.data.transactions.payment_url) {
                router.push(payload.data.transactions.payment_url);
              } else {
                getData(payload);
              }
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
        <div className="flex flex-col items-center md:py-4">
          <div className="md:border-2 md:border-blue-900 rounded-3xl p-6 w-full md:w-128">
            {/* The Portrait Place Logo */}
            <Image
              src="/portraitPlace.png"
              width={100}
              height={50}
              alt="The Portrait Place Logo"
              className="mb-3"
            />

            {/* Title */}
            <h1 className="text-xl font-sora font-bold mb-4">
              Ringkasan Pesanan
            </h1>

            {/* Warning-1 */}
            <div
              role="alert"
              className="alert bg-blue-50 border border-blue-900 text-blue-900 text-xs font-roboto font-bold p-1 mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Mohon Maaf, kamu sudah tidak dapat mengubah pesanan, karena
                pesananmu sudah dalam proses! Tetapi tenang saja, jika ingin
                mengubah pesanan dapat dilakukan saat hari kedatangan.
              </span>
            </div>

            {/* Booking Detail */}
            <div className="grid grid-cols-2 font-roboto">
              <div className="text-md">Kode Booking</div>
              <div className="text-right text-xs font-bold pt-1">
                {orderBook.book_code}
              </div>
              <div className="text-md">Lokasi</div>
              <div className="text-right text-xs pt-1">
                {orderBook.branch_address}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-rows-2 font-roboto mb-4">
              <div className="text-md">Tanggal dan Waktu</div>
              <div className="flex justify-end">
                <div className="text-xs text-right pt-1">
                  {orderBook.booking_date}
                </div>
                <div className="text-xs pl-2 xs:block hidden">
                  <div className="flex justify-end">
                    <span className="bg-blue-900 rounded-xl text-white text-xs flex justify-center item-center p-1">
                      <img
                        src="/clock.png"
                        alt="Clock Icon"
                        className="max-w-full h-auto rounded-full"
                      />
                      <p className="pl-1">{orderBook.start_at} WIB</p>
                    </span>
                  </div>
                </div>
              </div>
              <div className="xs:hidden"></div>
              <div className="xs:hidden text-xs">
                <div className="flex justify-end">
                  <span className="bg-blue-900 rounded-md text-white text-xs flex justify-center item-center p-1">
                    <img
                      src="/clock.png"
                      alt="Clock Icon"
                      className="max-w-full h-auto rounded-full"
                    />
                    <p className="pl-1">{orderBook.start_at} WIB</p>
                  </span>
                </div>
              </div>
            </div>

            <hr className="border mb-4"></hr>

            {/* Product */}
            <div className="grid grid-cols-2 grid-rows-3 mb-4">
              {/* Title */}
              <div className="text-md font-sora font-bold">Paket</div>
              <div></div>

              {/* Product Name and Price */}
              <div className="text-md font-roboto">
                {orderBook.product_name}
              </div>
              <div className="text-right text-xs font-roboto">
                {orderBook.product_price}
              </div>
              <div className="text-xs text-slate-400 font-roboto italic">
                {orderBook.product_type}
              </div>
              <div></div>
            </div>

            <hr className="border mb-4"></hr>

            {/* Additional */}
            <div className="grid grid-cols-2 grid-rows-9 mb-4">
              {/* Title */}
              <div className="text-md font-sora font-bold">Tambahan</div>
              <div></div>

              {/* Adult */}
              <div className="text-md font-roboto">Orang Dewasa</div>
              <div></div>
              <div className="text-xs text-slate-400 font-roboto">
                {orderBook.number_of_add_person}
              </div>
              <div className="text-right text-xs font-roboto">
                {orderBook.additional_person_price}
              </div>

              {/* Pet */}
              <div className="text-md font-roboto">Hewan Peliharaan</div>
              <div></div>
              <div className="text-xs text-slate-400 font-roboto">
                {orderBook.number_of_add_pet}
              </div>
              <div className="text-right text-xs font-roboto">
                {orderBook.additional_pet_price}
              </div>

              {/* Print5R */}
              <div className="text-md font-roboto">Print 5R</div>
              <div></div>
              <div className="text-xs text-slate-400 font-roboto">
                {orderBook.number_of_add_print5r}
              </div>
              <div className="text-right text-xs font-roboto">
                {orderBook.additional_print5r_price}
              </div>

              {/* Soft-File */}
              <div className="text-md font-roboto">Soft-File</div>
              <div></div>
              <div className="text-xs text-slate-400 font-roboto">
                {orderBook.number_of_add_softfile}
              </div>
              <div className="text-right text-xs font-roboto">
                {orderBook.additional_softfile_price}
              </div>
            </div>

            <hr className="border mb-4"></hr>

            {/* Sub-Total */}
            <div className="grid grid-cols-2 grid-rows-3 mb-4">
              {/* Title */}
              <div className="text-md font-sora font-bold">Subtotal</div>
              <div className="text-right text-xs font-roboto font-bold pt-1">
                {orderBook.total_price}
              </div>

              {/* Voucher */}
              <div className="text-md font-roboto ">Kode Voucher</div>
              <div className="text-right text-xs text-blue-900 font-roboto font-bold pt-1">
                {orderBook.voucher_code}
              </div>
              <div></div>
              <div className="text-right text-xs text-green-500 font-roboto pt-1">
                {orderBook.discount}
              </div>
            </div>

            <hr className="border mb-4"></hr>

            {/* Total */}
            <div className="grid grid-cols-2 mb-4">
              <div className="text-md font-sora font-bold">Total</div>
              <div className="text-right text-xs font-roboto font-bold pt-1">
                {orderBook.total_paid_by_cust}
              </div>
            </div>

            {/* Warning-2 */}
            <div
              role="alert"
              className="alert bg-red-50 border border-red-600 text-xs text-red-600 font-roboto p-1 mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                <div className="grid grid-cols-2 text-xs font-roboto font-bold">
                  <div className="text-left">
                    Segera lakukan pembayaran sebelum
                  </div>
                  <div className="text-right">{`${countdown.minutes} Menit ${countdown.seconds} Detik`}</div>
                </div>
              </span>
            </div>

            {/* Button */}
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-900 text-sm font-bold text-white font-poppins hover:bg-blue-700 rounded-xl w-full md:w-120 h-10"
                onClick={generateTransaction}
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
