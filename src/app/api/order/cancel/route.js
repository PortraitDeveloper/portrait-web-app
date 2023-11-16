import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

// Create data
export async function PATCH(request) {
  try {
    // Read the body data
    const body = await request.json();

    // Read orders_book data by current book_id and book_code
    const orderBook = await prisma.orders_book.findFirst({
      where: {
        book_id: body.book_id,
        book_code: body.book_code,
      },
    });

    // Check if book_status is booked or rescheduled then update orders_book data
    if (
      orderBook &&
      (orderBook.book_status === "booked" ||
        orderBook.book_status === "rescheduled")
    ) {
      // Update orders_book data
      const newData = await prisma.orders_book.update({
        where: {
          book_id: body.book_id,
          book_code: body.book_code,
        },
        data: {
          updated_at: currentTimeStamp,
          book_status: "canceled",
        },
      });

      console.log(currentTimeStamp, "Status: 200, Data updated");
      return NextResponse.json(newData, { status: 200 });
    } else {
      console.log(
        currentTimeStamp,
        "Status: 400, Order not found or not eligible for update"
      );
      return NextResponse.json(
        { error: "Order not found or not eligible for update" },
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
  } finally {
    await prisma.$disconnect();
  }
}
