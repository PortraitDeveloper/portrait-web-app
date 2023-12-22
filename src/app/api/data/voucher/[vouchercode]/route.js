import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { vouchercode } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read a the voucher data by voucher code
    const voucher = await prisma.vouchers.findUnique({
      where: {
        voucher_code: vouchercode,
      },
    });

    // If voucher data not found then return an error log
    if (!voucher) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/voucher/[vouchercode]",
        status: 404,
        message: "Voucher data not found.",
      };
      errorLog(log);
      return NextResponse.json(log);
    } else {
      // If voucher data found then return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher/[vouchercode]",
        status: 200,
        message: "Voucher data found.",
        data: voucher,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher/[vouchercode]",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
