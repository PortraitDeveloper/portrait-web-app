import { NextResponse } from "next/server";
import getTimeStamp from "@/utils/getTimeStamp";
import midtransClient from "midtrans-client";
import prisma from "@/utils/prisma";
import errorLog from "@/utils/errorLog";

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
        message: error.message,
      };
      errorLog(log);
      return NextResponse.json(log);
    } finally {
      await prisma.$disconnect();
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
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  }
}
