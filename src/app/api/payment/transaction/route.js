import { NextResponse } from "next/server";
import getTimeStamp from "@/utils/getTimeStamp";
import midtransClient from "midtrans-client";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;
// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function POST(request) {
  try {
    // Read the body data
    const body = await request.json();

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
        order_id: body.order_id,
        gross_amount: body.gross_amount,
      },
      customer_details: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
      },
    };

    // Create midtrans transaction
    const transaction = await snap.createTransaction(parameter);

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
