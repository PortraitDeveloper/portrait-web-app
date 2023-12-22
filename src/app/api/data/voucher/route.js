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
    // Read all voucher data
    const vouchers = await prisma.vouchers.findMany();

    // Return all voucher data
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 200,
      message: "Vouchers data found.",
      data: vouchers,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const {
      voucher_code,
      percentage_discount,
      nominal_discount,
      expired_date,
    } = await request.json();

    // Check whether the voucher data already exists
    const voucher = await prisma.vouchers.findFirst({
      where: {
        voucher_code,
      },
    });

    // If voucher data already exists then return an error log
    if (voucher) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Voucher data already exists.",
      };
      return NextResponse.json(log);
    } else {
      // Create a new voucher data
      const newData = await prisma.vouchers.create({
        data: {
          voucher_code,
          percentage_discount,
          nominal_discount,
          start_date: currentTimeStamp,
          expired_date,
        },
      });

      console.log(newData);

      // Return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 201,
        message: "Voucher data inserted.",
        data: newData,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
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

  try {
    // Read the body data
    const {
      voucher_code,
      percentage_discount,
      nominal_discount,
      expired_date,
    } = await request.json();

    // Update the voucher data
    const newData = await prisma.vouchers.update({
      where: { voucher_code },
      data: {
        percentage_discount: percentage_discount ? percentage_discount : null,
        nominal_discount: nominal_discount ? nominal_discount : null,
        expired_date,
      },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 200,
      message: "Voucher data updated.",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { voucher_code } = await request.json();

    // Delete the voucher data by voucher code
    await prisma.vouchers.delete({
      where: { voucher_code },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 200,
      message: "Voucher data has been deleted.",
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
