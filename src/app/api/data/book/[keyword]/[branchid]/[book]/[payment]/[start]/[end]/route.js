import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(
  request,
  { params: { keyword, branchid, book, payment, start, end } }
) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route:
          "/api/data/book/[keyword]/[branchid]/[book]/[payment]/[start]/[end]",
        status: 401,
        message: "Suspicious request, not authorized to get data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    const keyWord = keyword === "null" ? "" : keyword;
    const branchId = branchid === "all" ? "" : branchid;
    const bookStatus = book === "all" ? "" : book;
    let ordersBook;

    if (payment === "all") {
      ordersBook = await prisma.orders_book.findMany({
        include: {
          transactions: true,
          customers: true,
          products: {
            include: {
              branches: true,
            },
          },
        },
        where: {
          OR: [
            {
              book_code: {
                contains: keyWord,
                mode: "insensitive",
              },
            },
            {
              customers: {
                cust_name: {
                  contains: keyWord,
                  mode: "insensitive",
                },
              },
            },
          ],
          products: {
            branch_id: {
              contains: branchId,
              mode: "insensitive",
            },
          },
          book_status: {
            contains: bookStatus,
            mode: "insensitive",
          },
          transactions: {
            payment_status: {
              contains: "",
              mode: "insensitive",
            },
          },
          booking_date: {
            gte: start,
            lte: end,
          },
        },
      });
    }

    if (payment !== "all") {
      ordersBook = await prisma.orders_book.findMany({
        include: {
          transactions: true,
          customers: true,
          products: {
            include: {
              branches: true,
            },
          },
        },
        where: {
          OR: [
            {
              book_code: {
                contains: keyWord,
                mode: "insensitive",
              },
            },
            {
              customers: {
                cust_name: {
                  contains: keyWord,
                  mode: "insensitive",
                },
              },
            },
          ],
          products: {
            branch_id: {
              contains: branchId,
              mode: "insensitive",
            },
          },
          book_status: {
            contains: bookStatus,
            mode: "insensitive",
          },
          transactions: {
            payment_status: {
              equals: payment,
              mode: "insensitive",
            },
          },
          booking_date: {
            gte: start,
            lte: end,
          },
        },
      });
    }

    // Check whether ordersBook data exists or not
    if (!ordersBook || ordersBook.length === 0) {
      // If ordersBook data not found then return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route:
          "/api/data/book/[keyword]/[branchid]/[book]/[payment]/[start]/[end]",
        status: 404,
        message: "Orders data not found",
      });
    } else {
      // If ordersBook data found then return ordersBook data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route:
          "/api/data/book/[keyword]/[branchid]/[book]/[payment]/[start]/[end]",
        status: 200,
        message: "Orders data found",
        data: ordersBook,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route:
        "/api/data/book/[keyword]/[branchid]/[book]/[payment]/[start]/[end]",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
