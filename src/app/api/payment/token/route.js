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
    
    const snap = new midtransClient.Snap({
      isProduction: false, // Sandbox
      // isProduction: true, // Production
      serverKey: process.env.NEXT_PUBLIC_SERVER_KEY_DEV,
      clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY_DEV,
    });

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

    const transaction = await snap.createTransaction(parameter);
    const token = transaction.token;
    const paymentUrl = transaction.redirect_url;

    console.log(currentTimeStamp, `Status: 200, Token: ${token}`);
    console.log(currentTimeStamp, `Status: 200, Payment URL: ${paymentUrl}`);
    return NextResponse.json({ token, paymentUrl }, { status: 200 });
  } catch (error) {
    const log = {
      created_at: currentTimeStamp,
      route: "/api/payment/token",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  }
}
