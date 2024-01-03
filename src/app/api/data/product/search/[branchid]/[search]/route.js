import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { branchid, search } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read parameters
    const branch_id = branchid;
    const searchBy = search === "nothing" ? "%%" : "%" + search + "%";

    // Search products data
    const products =
      await prisma.$queryRaw`SELECT * FROM products WHERE branch_id = ${branch_id} AND product_name LIKE ${searchBy}`;
    console.log("PRODUCT:", products);
    // Check whether products data exists or not
    if (!products || products.length === 0) {
      // If products data not found then return error message
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/product/search/[branchid]/[search]",
        status: 404,
        message: "Products data not found.",
      };
      errorLog(log);
      return NextResponse.json(log);
    } else {
      // If products data found then return products data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product/search/[branchid]/[search]",
        status: 200,
        message: "Products data found.",
        data: products,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product/search/[branchid]/[search]",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
