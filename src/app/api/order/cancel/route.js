import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prisma initial
const prisma = new PrismaClient();

// Create data
export async function PATCH(request) {
  try {
    // Read the body data
    const body = await request.json();

    // Generate timestamp and convert to WIB or Asia/Jakarta Timezone
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

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
          updated_at: currentDate,
          book_status: "canceled",
        },
      });

      console.log(currentDate, "Status: 200, Data updated");
      return NextResponse.json(newData, { status: 200 });
    } else {
      console.log(
        currentDate,
        "Status: 400, Order not found or not eligible for update"
      );
      return NextResponse.json(
        { error: "Order not found or not eligible for update" },
        { status: 400 }
      );
    }
  } catch (error) {
    const _currentDate = new Date();
    _currentDate.setHours(_currentDate.getHours() + 7);
    console.log(
      _currentDate,
      "Status: 500, An error occurred while processing the request"
    );
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
