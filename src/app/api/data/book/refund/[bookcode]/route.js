import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { bookcode } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the order book data by book ID
    const orderBook = await prisma.orders_book.findUnique({
      where: {
        book_code: bookcode,
      },
      include: {
        transactions: true,
        customers: true,
        products: {
          include: {
            branches: true,
          },
        },
      },
    });

    const bookingDate = new Date(orderBook.booking_date);

    if (
      orderBook.transactions.payment_status === "refund" ||
      orderBook.transactions.payment_status === "unpaid"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book/[bookcode]",
        status: 404,
        message: `Booking ${orderBook.book_code} tidak bisa di refund`,
      });
    }

    if (
      bookingDate < currentTimeStamp &&
      (orderBook.book_status === "booked" ||
        orderBook.book_status === "rescheduled")
    ) {
      await prisma.orders_book.update({
        where: {
          book_code: bookcode,
        },
        data: {
          transactions: {
            update: {
              where: {
                book_code: bookcode,
              },
              data: {
                payment_status: "refund 50%",
              },
            },
          },
        },
      });

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book/[bookcode]",
        status: 200,
        message: `Pesanan ${orderBook.book_code} telah di refund 50%`,
        data: orderBook,
      });
    }

    if (
      orderBook.book_status === "booked" ||
      orderBook.book_status === "rescheduled"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book/[bookcode]",
        status: 404,
        message: `Customer harus membatalkan booking terlebih dahulu`,
      });
    }

    await prisma.orders_book.update({
      where: {
        book_code: bookcode,
      },
      data: {
        transactions: {
          update: {
            where: {
              book_code: bookcode,
            },
            data: {
              payment_status: "refund",
            },
          },
        },
      },
    });

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/book/[bookcode]",
      status: 200,
      message: `Pesanan ${orderBook.book_code} telah di refund`,
      data: orderBook,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book/[bookcode]",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
