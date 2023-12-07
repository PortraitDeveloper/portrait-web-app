import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

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
      revalidated: true,
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

// export async function PATCH(request) {
//   // Generate timestamp / current datetime
//   const currentTimeStamp = getTimeStamp(timeDiff);

//   try {
//     // Read the body data
//     const {} = await request.json();

//     // Update the product data
//     const newData = await prisma.orders_book.update({
//       where: { book_id },
//       data: {},
//     });

//     // Return a success log and new data
//     return NextResponse.json({
//       created_at: currentTimeStamp,
//       route: "/api/data/product",
//       status: 200,
//       message: "Order book data updated.",
//       data: newData,
//     });
//   } catch (error) {
//     // If the system or database server error then return an error log
//     const log = {
//       created_at: currentTimeStamp,
//       route: "/api/data/product",
//       status: 500,
//       message: error.message,
//     };
//     errorLog(log);
//     return NextResponse.json(log);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
