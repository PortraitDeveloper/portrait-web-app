import { NextResponse } from "next/server";
import getTimeStamp from "@/utils/getTimeStamp";
import midtransClient from "@/node_modules/midtrans-client";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function POST(request) {
  try {
    // Read the body data
    const body = await request.json();
    console.log("body:", body);

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

    let token = null;
    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };

      token = transaction.token;
      console.log(currentTimeStamp, "Status: 200, Got token");
      return NextResponse.json(token, { status: 200 });
    });
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
