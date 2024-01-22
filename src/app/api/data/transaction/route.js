import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import moment from "moment";
import "moment-timezone";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/transaction",
        status: 401,
        message: "Suspicious request, not authorized to alter data".trim(),
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to alter this data" },
        { status: 401 }
      );
    }

    const { book_code } = await request.json();

    const orderBook = await prisma.orders_book.findUnique({
      where: {
        book_code: book_code,
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

    const bookingDate = moment(
      `${orderBook.booking_date} ${orderBook.start_at}:00.000`
    )
      .tz("Asia/Jakarta")
      .format();

    const dateNow = moment().tz("Asia/Jakarta").format();

    if (
      orderBook.transactions.payment_status === "refund" ||
      orderBook.transactions.payment_status === "partial_refund" ||
      orderBook.transactions.payment_status === "unpaid" ||
      orderBook.book_status === "done"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/transaction",
        status: 400,
        message: `Booking ${orderBook.book_code} tidak bisa di refund`,
      });
    }

    if (
      bookingDate < dateNow &&
      (orderBook.book_status === "booked" ||
        orderBook.book_status === "rescheduled")
    ) {
      await updatePaymentStatus(book_code, "partial_refund");

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/transaction",
        status: 200,
        message: `Pesanan ${orderBook.book_code} telah di refund sebagian`,
        data: orderBook,
      });
    }

    if (
      orderBook.book_status === "booked" ||
      orderBook.book_status === "rescheduled"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/transaction",
        status: 400,
        message: `Customer harus membatalkan booking terlebih dahulu`,
      });
    }

    await updatePaymentStatus(book_code, "refund");

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/transaction/",
      status: 200,
      message: `Pesanan ${book_code} telah di refund`,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/transaction",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

async function updatePaymentStatus(bookCode, paymentStatus) {
  const currentTimeStamp = getTimeStamp(timeDiff);

  await prisma.orders_book.update({
    where: {
      book_code: bookCode,
    },
    data: {
      transactions: {
        update: {
          where: {
            book_code: bookCode,
          },
          data: {
            updated_at: currentTimeStamp,
            payment_status: paymentStatus,
          },
        },
      },
    },
  });
}
