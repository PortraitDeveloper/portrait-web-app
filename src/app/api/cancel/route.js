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

    // Read orders_book data by current book_id and book_ref
    const orderBook = await prisma.orders_book.findFirst({
      where: {
        book_id: body.book_id,
        book_ref: body.book_ref,
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
          book_ref: body.book_ref,
        },
        data: {
          updated_at: currentDate,
          book_status: "canceled",
        },
      });

      return NextResponse.json(newData, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Order not found or not eligible for update" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
