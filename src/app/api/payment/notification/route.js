import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";
import crypto from "crypto";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

const server_key = process.env.NEXT_PUBLIC_SERVER_KEY_DEV;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  // Function for update a transaction data
  const updateTransaction = async (order_id, paymentStatus) => {
    try {
      // Update payment status transaction data by book code or order ID
      await prisma.transactions.update({
        where: {
          book_code: order_id,
        },
        data: {
          payment_status: paymentStatus,
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
    }
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

    // Checking whether the payment is valid. If the signature key is the same as the hashed one then the transaction is valid
    if (hashed === signature_key) {
      if (transaction_status == "capture") {
        if (fraud_status == "accept") {
          const log = {
            created_at: currentTimeStamp,
            route: "/api/payment/notification",
            status: 200,
            message: "paid",
          };

          updateTransaction(order_id, log.message);
          console.log(log);
          return NextResponse.json(log);
        }
      } else if (transaction_status == "settlement") {
        const log = {
          created_at: currentTimeStamp,
          route: "/api/payment/notification",
          status: 200,
          message: "paid",
        };

        updateTransaction(order_id, log.message);
        console.log(log);
        return NextResponse.json(log);
      } else if (
        transaction_status == "cancel" ||
        transaction_status == "deny" ||
        transaction_status == "expire"
      ) {
        const log = {
          created_at: currentTimeStamp,
          route: "/api/payment/notification",
          status: 200,
          message: transaction_status,
        };

        updateTransaction(order_id, log.message);
        console.log(log);
        return NextResponse.json(log);
      } else if (transaction_status == "pending") {
        const log = {
          created_at: currentTimeStamp,
          route: "/api/payment/notification",
          status: 200,
          message: transaction_status,
        };

        updateTransaction(order_id, log.message);
        console.log(log);
        return NextResponse.json(log);
      }
    } else {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/payment/notification",
        status: 400,
        message: "Payment is not valid",
      };
      errorLog(log);
      return NextResponse.json(log);
    }
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
  }
}
