import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";
import crypto from "crypto";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

const server_key = process.env.NEXT_PUBLIC_SERVER_KEY_DEV;

export async function POST(request) {
  // Function for update a transaction data
  const updateTransaction = async (order_id, paymentStatus) => {
    // Update payment status transaction data by book code or order ID
    await prisma.transactions.update({
      where: {
        book_code: order_id,
      },
      data: {
        payment_status: paymentStatus,
      },
    });
  };

  try {
    // Read the body data
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = await request.json();

    // Concatenate the values
    const concatenatedString =
      order_id + status_code + gross_amount + server_key;

    // Create a SHA-512 hash
    const hashed = crypto
      .createHash("sha512")
      .update(concatenatedString)
      .digest("hex");

    if (hashed === signature_key) {
      if (transaction_status == "capture") {
        if (fraud_status == "accept") {
          const paymentStatus = "paid";
          updateTransaction(order_id, paymentStatus);

          // and response with 200 OK
          console.log(
            currentTimeStamp,
            `Status: 200, Payment status is ${transaction_status}`
          );

          return NextResponse.json(
            { message: `Payment status is ${transaction_status}` },
            { status: 200 }
          );
        }
      } else if (transaction_status == "settlement") {
        // TODO set transaction status on your database to 'success'
        const paymentStatus = "paid";
        updateTransaction(order_id, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transaction_status}`
        );

        return NextResponse.json(
          { message: `Payment status is ${transaction_status}` },
          { status: 200 }
        );
      } else if (
        transaction_status == "cancel" ||
        transaction_status == "deny" ||
        transaction_status == "expire"
      ) {
        // TODO set transaction status on your database to 'failure'
        const paymentStatus = transaction_status;
        updateTransaction(order_id, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transaction_status}`
        );
        return NextResponse.json(
          { message: `Payment status is ${transaction_status}` },
          { status: 200 }
        );
      } else if (transaction_status == "pending") {
        // TODO set transaction status on your database to 'pending' / waiting payment
        const paymentStatus = transaction_status;
        updateTransaction(order_id, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transaction_status}`
        );
        return NextResponse.json(
          { message: `Payment status is ${transaction_status}` },
          { status: 200 }
        );
      }
    } else {
      console.log(currentTimeStamp, `Status: 400, Payment is not valid`);
      return NextResponse.json(
        { message: `Payment is not valid` },
        { status: 400 }
      );
    }
  } catch (error) {
    // If the system or server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/payment/notification",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  }
}
