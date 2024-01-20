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

export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);
  const {
    book_id,
    book_code,
    product_id,
    number_of_add_person,
    number_of_add_pet,
    number_of_add_print5r,
    is_add_softfile,
    product_price,
    additional_person_price,
    additional_pet_price,
    additional_print5r_price,
    additional_softfile_price,
    total_price,
    total_paid_by_cust,
    prev_total,
    price_diff,
  } = await request.json();

  try {
    const checkOrder = await prisma.orders_book.findUnique({
      where: { book_id: book_id, book_code: book_code },
      include: {
        transactions: true,
      },
    });

    const book = checkOrder.book_status;
    const payment = checkOrder.transactions.payment_status;

    if (
      book === "canceled" ||
      payment === "pending" ||
      payment === "refund" ||
      payment === "partial_refund"
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book/",
        status: 400,
        message: `Pesanan ${book_code} tidak bisa diubah`,
      });
    }

    await prisma.orders_book.update({
      where: {
        book_id: book_id,
        book_code: book_code,
      },
      data: {
        products: {
          connect: {
            product_id: product_id,
          },
        },
        number_of_add_person: parseInt(number_of_add_person),
        number_of_add_pet: parseInt(number_of_add_pet),
        number_of_add_print5r: parseInt(number_of_add_print5r),
        is_add_softfile: is_add_softfile === 1 ? true : false,
        transactions: {
          update: {
            where: {
              book_code: book_code,
            },
            data: {
              product_price: parseInt(product_price),
              additional_person_price: parseInt(additional_person_price),
              additional_pet_price: parseInt(additional_pet_price),
              additional_print5r_price: parseInt(additional_print5r_price),
              additional_softfile_price: parseInt(additional_softfile_price),
              total_price: parseInt(total_price),
              total_paid_by_cust: parseInt(total_paid_by_cust),
              prev_total: parseInt(prev_total),
              price_diff: parseInt(price_diff),
            },
          },
        },
      },
    });

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/book/",
      status: 200,
      message: `Pesanan ${book_code} berhasil diubah`,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
