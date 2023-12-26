import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read Json Web Token for authorization
    const accessToken = request.headers.get("Authorization");

    // If token not found then user not authorized to get data
    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/book",
        status: 401,
        message: "Suspicious request! Not authorized to get data",
      };
      errorLog(log);
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

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
