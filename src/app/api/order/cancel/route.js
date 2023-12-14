import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Create data
export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { book_id, book_code } = await request.json();

    // Read orders_book data by current book_id and book_code
    const orderBook = await prisma.orders_book.findFirst({
      where: {
        book_id: book_id,
        book_code: book_code,
      },
    });

    // Check if book_status is booked or rescheduled then update orders_book data
    if (
      orderBook &&
      (orderBook.book_status === "booked" ||
        orderBook.book_status === "rescheduled")
    ) {
      // Update order book data
      const newData = await prisma.orders_book.update({
        where: {
          book_id: book_id,
          book_code: book_code,
        },
        data: {
          updated_at: currentTimeStamp,
          book_status: "canceled",
        },
      });

      console.log(currentTimeStamp, "Status: 200", "Order book data updated!");

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/order/cancel",
        status: 200,
        message: "Order book data updated!",
        data: newData,
      });
    } else {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/order/cancel",
        status: 400,
        message: "Order not found or not eligible for update!",
      };
      errorLog(log);
      return NextResponse.json(log);
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/order/cancel",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
