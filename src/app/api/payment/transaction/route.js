import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import midtransClient from "midtrans-client";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  // Function for update a transaction data
  const updateTransaction = async (order_id, paymentUrl) => {
    try {
      // Update payment status transaction data by book code or order ID
      await prisma.transactions.update({
        where: {
          book_code: order_id,
        },
        data: {
          payment_url: paymentUrl,
        },
      });
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
  };

  try {
    // Read the body data
    const {
      order_id,
      gross_amount,
      first_name,
      last_name,
      email,
      phone_number,
    } = await request.json();

    console.log("ORDER_ID:", order_id);
    console.log("GROSS AMOUNT:", gross_amount);
    console.log("FIRST NAME:", first_name);
    console.log("LAST NAME:", last_name);
    console.log("EMAIL:", email);
    console.log("PHONE NUMBER:", phone_number);

    // Midtrans client config
    const snap = new midtransClient.Snap({
      isProduction: false, // Sandbox
      // isProduction: true, // Production
      serverKey: process.env.NEXT_PUBLIC_SERVER_KEY_DEV,
      clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY_DEV,
    });

    // Parameter config
    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      customer_details: {
        first_name,
        last_name,
        email,
        phone_number,
      },
    };

    // Create midtrans transaction
    const transaction = await snap.createTransaction(parameter);
    updateTransaction(order_id, transaction.redirect_url);

    // return a success log which has token and url transaction
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/payment/transaction",
      status: 200,
      message: "The transaction has been generated.",
      data: transaction,
    });
  } catch (error) {
    // If the system or server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/payment/transaction",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  }
}
