import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import crypto from "crypto";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;
// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function POST(request) {
  const updateTransaction = async (orderId, paymentStatus) => {
    await prisma.transactions.update({
      where: {
        book_code: orderId,
      },
      data: {
        payment_status: paymentStatus,
      },
    });
  };

  try {
    // Read the body data
    const body = await request.json();
    console.log("body:", body);

    const serverKey = process.env.NEXT_PUBLIC_SERVER_KEY_DEV;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const signatureKey = body.signature_key;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    // Concatenate the values
    const concatenatedString = orderId + statusCode + grossAmount + serverKey;

    // Create a SHA-512 hash
    const hashed = crypto
      .createHash("sha512")
      .update(concatenatedString)
      .digest("hex");

    console.log("SHA-512 Hash:", hashed);
    console.log("SignatureKey:", signatureKey);

    if (hashed === signatureKey) {
      if (transactionStatus == "capture") {
        if (fraudStatus == "accept") {
          // TODO set transaction status on your database to 'success'
          const paymentStatus = "paid";
          updateTransaction(orderId, paymentStatus);

          // and response with 200 OK
          console.log(
            currentTimeStamp,
            `Status: 200, Payment status is ${transactionStatus}`
          );

          return NextResponse.json(
            { message: `Payment status is ${transactionStatus}` },
            { status: 200 }
          );
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your database to 'success'
        const paymentStatus = "paid";
        updateTransaction(orderId, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transactionStatus}`
        );

        return NextResponse.json(
          { message: `Payment status is ${transactionStatus}` },
          { status: 200 }
        );
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your database to 'failure'
        const paymentStatus = transactionStatus;
        updateTransaction(orderId, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transactionStatus}`
        );
        return NextResponse.json(
          { message: `Payment status is ${transactionStatus}` },
          { status: 200 }
        );
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your database to 'pending' / waiting payment
        const paymentStatus = transactionStatus;
        updateTransaction(orderId, paymentStatus);

        // and response with 200 OK
        console.log(
          currentTimeStamp,
          `Status: 200, Payment status is ${transactionStatus}`
        );
        return NextResponse.json(
          { message: `Payment status is ${transactionStatus}` },
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
    console.log(
      currentTimeStamp,
      "Status: 500, An error occurred while processing the request"
    );
    return NextResponse.json(
      { error: "Status: 500, An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
