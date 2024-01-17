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

// export async function GET(request) {
//   // Generate timestamp / current datetime
//   const currentTimeStamp = getTimeStamp(timeDiff);

//   try {
//     // Read Json Web Token for authorization
//     const accessToken = request.headers.get("Authorization");

//     // If token not found then user not authorized to get data
//     if (!accessToken) {
//       const log = {
//         created_at: currentTimeStamp,
//         route: "/api/data/book",
//         status: 401,
//         message: "Suspicious request or not authorized to get data!",
//       };
//       errorLog(log);
//       return NextResponse.json({ message: "Not authorized" }, { status: 401 });
//     }

//     // Read all product data
//     const ordersBook = await prisma.orders_book.findMany({
//       include: {
//         transactions: true,
//         customers: true,
//         products: {
//           include: {
//             branches: true,
//           },
//         },
//       },
//     });

//     // Return all product data
//     return NextResponse.json({
//       created_at: currentTimeStamp,
//       route: "/api/data/book",
//       status: 200,
//       message: "Orders book data found.",
//       data: ordersBook,
//     });
//   } catch (error) {
//     // If the system or database server error then return an error log
//     const log = {
//       created_at: currentTimeStamp,
//       route: "/api/data/book",
//       status: 500,
//       message: error.message,
//     };
//     errorLog(log);
//     return NextResponse.json(log);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function GET(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read all product data
    const ordersBook = await prisma.orders_book.findMany({
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

    // Return all product data
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/book",
      status: 200,
      message: "Orders book data found.",
      data: ordersBook,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);
  const { book_code } = await request.json();

  try {
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
      orderBook.transactions.payment_status === "refund 50%" ||
      orderBook.transactions.payment_status === "unpaid"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book",
        status: 400,
        message: `Booking ${orderBook.book_code} tidak bisa di refund`,
      });
    }

    if (
      bookingDate < dateNow &&
      (orderBook.book_status === "booked" ||
        orderBook.book_status === "rescheduled")
    ) {
      await updatePaymentStatus(book_code, "refund 50%");

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book",
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
        route: "/api/data/book",
        status: 400,
        message: `Customer harus membatalkan booking terlebih dahulu`,
      });
    }

    await updatePaymentStatus(book_code, "refund");

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/book/",
      status: 200,
      message: `Pesanan ${book_code} telah di refund`,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

async function updatePaymentStatus(bookCode, paymentStatus) {
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
            payment_status: paymentStatus,
          },
        },
      },
    },
  });
}
