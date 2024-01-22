import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { branchid, keyword } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route:
          "/api/data/product/[keyword]/[branchid]",
        status: 401,
        message: "Suspicious request, not authorized to get data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    // Read parameters
    const keyWord = keyword === "null" ? "%%" : "%" + keyword + "%";

    // Search products data
    const products =
      branchid === "all"
        ? await prisma.$queryRaw`SELECT * FROM products WHERE product_name LIKE ${keyWord} ORDER BY CAST(SUBSTRING(product_id, 4) AS INTEGER) ASC`
        : await prisma.$queryRaw`SELECT * FROM products WHERE branch_id = ${branchid} AND product_name LIKE ${keyWord} ORDER BY CAST(SUBSTRING(product_id, 4) AS INTEGER) ASC`;

    // Check whether products data exists or not
    if (!products || products.length === 0) {
      // If products data not found then return error message

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product/[branchid]/[keyword]",
        status: 404,
        message: "Products data not found.",
      });
    } else {
      // If products data found then return products data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product/[branchid]/[keyword]",
        status: 200,
        message: "Products data found.",
        data: products,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product/[branchid]/[keyword]",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
