/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";
import Checkout from "./components/Checkout";
import SetCountdown from "./utils/SetCountdown";
import DataConvertion from "./utils/DataConvertion";
import getTimeStamp from "@/utils/getTimeStamp";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Set timeout 15 minute
const timeOut = 15;

// Set redirect URL
const redirectUrl = "https://msha.ke/bookingstudio";

export default function CheckoutPage() {
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
    gross_amount: "",
  });

  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    generateData(book_id);
  }, [book_id]);

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
        message: error.message,
      };
      console.error(log);
    }
  };

  const getData = (payload) => {
    // Setup countdown
    const countdown = SetCountdown(payload.data.created_at, timeOut, timeDiff);

    // If timeout then redirect page
    if (countdown.minutes <= 0) {
      router.push(redirectUrl);
    } else {
      // Payload data convertion
      const convertion = DataConvertion(payload);

      setOrderBook({
        book_code: payload.data.book_code,
        first_name: convertion.first_name,
        last_name: convertion.last_name,
        email: payload.data.customers.email,
        phone_number: payload.data.customers.phone_number,
        branch_address: payload.data.products.branches.branch_address,
        booking_date: convertion.booking_date,
        start_at: payload.data.start_at,
        product_name: convertion.product_name,
        product_type: convertion.product_type,
        product_price: convertion.product_price,
        number_of_add_person: convertion.number_of_add_person,
        additional_person_price: convertion.additional_person_price,
        number_of_add_pet: convertion.number_of_add_pet,
        additional_pet_price: convertion.additional_pet_price,
        number_of_add_print5r: convertion.number_of_add_print5r,
        additional_print5r_price: convertion.additional_print5r_price,
        number_of_add_softfile: convertion.number_of_add_softfile,
        additional_softfile_price: convertion.additional_softfile_price,
        total_price: convertion.total_price,
        voucher_code: convertion.voucher_code,
        discount: convertion.discount,
        total_paid_by_cust: convertion.total_paid_by_cust,
        gross_amount: payload.data.transactions.total_paid_by_cust,
      });

      setCountdown({
        minutes: countdown.minutes,
        seconds: countdown.seconds,
      });

      setLoading(true);
    }
  };

  const generateTransaction = async () => {
    setLoading(false);
    try {
      const body = {
        order_id: orderBook.book_code,
        gross_amount: orderBook.gross_amount,
        first_name: orderBook.first_name,
        last_name: orderBook.last_name,
        email: orderBook.email,
        phone_number: orderBook.phone_number,
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
        message: error.message,
      };
      console.error(log);
    }
  };

  const generateEmail = async (paymentUrl) => {
    try {
      const body = {
        email: orderBook.email,
        subject: "Konfirmasi Pembayaran",
        book_code: orderBook.book_code,
        branch_address: orderBook.branch_address,
        booking_date: orderBook.booking_date,
        start_at: orderBook.start_at,
        product_name: orderBook.product_name,
        product_type: orderBook.product_type,
        product_price: orderBook.product_price,
        number_of_add_person: orderBook.number_of_add_person,
        additional_person_price: orderBook.additional_person_price,
        number_of_add_pet: orderBook.number_of_add_pet,
        additional_pet_price: orderBook.additional_pet_price,
        number_of_add_print5r: orderBook.number_of_add_print5r,
        additional_print5r_price: orderBook.additional_print5r_price,
        number_of_add_softfile: orderBook.number_of_add_softfile,
        additional_softfile_price: orderBook.additional_softfile_price,
        total_price: orderBook.total_price,
        voucher_code: orderBook.voucher_code,
        discount: orderBook.discount,
        total_paid_by_cust: orderBook.total_paid_by_cust,
        payment_url: paymentUrl,
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
        message: error.message,
      };
      console.error(log);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Subtracts the time every second
      setCountdown((prevCountdown) => {
        const newSeconds = prevCountdown.seconds - 1;
        const newMinutes =
          newSeconds < 0 ? prevCountdown.minutes - 1 : prevCountdown.minutes;
        const seconds = newSeconds < 0 ? 59 : newSeconds;

        // If time out then redirect page
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

  return (
    <>
      {!loading && <Loading />}
      {loading && (
        <>
          <Checkout
            getHandleTransaction={generateTransaction}
            orderBook={orderBook}
            countdown={countdown}
          />
        </>
      )}
    </>
  );
}
