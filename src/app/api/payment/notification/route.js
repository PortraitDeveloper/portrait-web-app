import { NextResponse } from "next/server";
import getTimeStamp from "@/utils/getTimeStamp";
import crypto from "crypto";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;
// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function POST(request) {
  try {
    // Read the body data
    const body = await request.json();
    console.log("body:", body);

    // Example values (replace these with your actual data)
    const order_id = body.order_id;
    const status_code = body.status_code;
    const gross_amount = body.gross_amount;
    const serverKey = process.env.NEXT_PUBLIC_SERVER_KEY_DEV;

    // Concatenate the values
    const concatenatedString =
      order_id + status_code + gross_amount + serverKey;

    // Create a SHA-512 hash
    const hashed = crypto
      .createHash("sha512")
      .update(concatenatedString)
      .digest("hex");

    console.log("SHA-512 Hash:", hashed);
    console.log("SignatureKey:", body.signature_key)

    console.log(currentTimeStamp, "Status: 200, Payment status is paid");
    return NextResponse.json(
      { message: "Payment status is paid" },
      { status: 200 }
    );
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
