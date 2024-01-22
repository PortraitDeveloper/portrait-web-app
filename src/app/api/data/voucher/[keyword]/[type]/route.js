import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { keyword, type } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/voucher/[keyword]/[type]",
        status: 401,
        message: "Suspicious request, not authorized to get data".trim(),
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    // const keyWord = keyword === "null" ? "%%" : "%" + keyword + "%";

    // const vouchers =
    //   type === "percentage"
    //     ? await prisma.$queryRaw`SELECT * FROM vouchers WHERE voucher_code LIKE ${keyWord} AND percentage_discount IS NOT NULL ORDER BY expired_date ASC`
    //     : type === "nominal"
    //     ? await prisma.$queryRaw`SELECT * FROM vouchers WHERE voucher_code LIKE ${keyWord} AND nominal_discount IS NOT NULL ORDER BY expired_date ASC`
    //     : await prisma.$queryRaw`SELECT * FROM vouchers`;

    // Read parameters
    const keyWord = keyword === "null" ? "" : keyword;

    // Search vouchers data
    const vouchers =
      type === "percentage"
        ? await prisma.vouchers.findMany({
            where: {
              voucher_code: {
                contains: keyWord,
                mode: "insensitive",
              },
              percentage_discount: {
                not: null,
              },
            },
            orderBy: {
              expired_date: "asc",
            },
          })
        : type === "nominal"
        ? await prisma.vouchers.findMany({
            where: {
              voucher_code: {
                contains: keyWord,
                mode: "insensitive",
              },
              nominal_discount: {
                not: null,
              },
            },
            orderBy: {
              expired_date: "asc",
            },
          })
        : await prisma.vouchers.findMany({
            orderBy: {
              expired_date: "asc",
            },
          });

    // Check whether vouchers data exists or not
    if (!vouchers || vouchers.length === 0) {
      // If vouchers data not found then return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher/[keyword]/[type]",
        status: 404,
        message: "Vouchers data not found",
      });
    } else {
      // If vouchers data found then return vouchers data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher/[keyword]/[type]",
        status: 200,
        message: "Vouchers data found",
        data: vouchers,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher/[keyword]/[type]",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
