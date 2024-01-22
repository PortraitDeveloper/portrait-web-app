import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 401,
        message: "Suspicious request, not authorized to create",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to create this data" },
        { status: 401 }
      );
    }

    // Read the body data
    const {
      voucher_code,
      percentage_discount,
      nominal_discount,
      expired_date,
    } = await request.json();

    if (
      !voucher_code ||
      !expired_date ||
      (!percentage_discount && !nominal_discount)
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "All fields are required to be filled in",
      });
    }

    let percentageDiscount = parseInt(percentage_discount);
    const nominalDiscount = parseInt(nominal_discount);

    if (
      nominalDiscount <= 0 ||
      percentageDiscount <= 0 ||
      percentageDiscount > 99
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Invalid discount value",
      });
    }

    percentageDiscount = parseFloat(percentageDiscount / 100);

    if (new Date(expired_date) < new Date()) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Invalid expired date",
      });
    }

    // Check whether the voucher data already exists
    const voucherExist = await prisma.vouchers.findUnique({
      where: {
        voucher_code,
      },
    });

    // If voucher data already exists then return an error log
    if (voucherExist) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Voucher code already exists",
      });
    }

    // Create a new voucher data
    const newData = await prisma.vouchers.create({
      data: {
        voucher_code,
        percentage_discount: percentageDiscount,
        nominal_discount: nominalDiscount,
        start_date: currentTimeStamp,
        expired_date,
      },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 201,
      message: "Voucher data inserted.",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 500,
      message: error.message.trim(),
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
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 401,
        message: "Suspicious request, not authorized to alter",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to alter this data" },
        { status: 401 }
      );
    }

    // Read the body data
    const {
      voucher_code,
      percentage_discount,
      nominal_discount,
      start_date,
      expired_date,
    } = await request.json();

    if (
      !voucher_code ||
      !expired_date ||
      (!percentage_discount && !nominal_discount)
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "All fields are required to be filled in",
      });
    }

    let percentageDiscount = parseInt(percentage_discount);
    const nominalDiscount = parseInt(nominal_discount);

    if (
      nominalDiscount <= 0 ||
      percentageDiscount <= 0 ||
      percentageDiscount > 99
    ) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Invalid discount value",
      });
    }

    percentageDiscount = parseFloat(percentageDiscount / 100);

    const existingData = await prisma.vouchers.findFirst({
      where: {
        voucher_code,
        percentage_discount: percentageDiscount,
        nominal_discount: nominalDiscount,
        start_date,
        expired_date,
      },
    });

    if (existingData) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Voucher data already exist",
      });
    }

    if (new Date(expired_date) < new Date()) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/voucher",
        status: 400,
        message: "Invalid expired date",
      });
    }

    // Update the voucher data
    const newData = await prisma.vouchers.update({
      where: { voucher_code },
      data: {
        percentage_discount: percentage_discount ? percentageDiscount : null,
        nominal_discount: nominal_discount ? nominalDiscount : null,
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
      message: error.message.trim(),
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
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 401,
        message: "Suspicious request, not authorized to delete",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to delete this data" },
        { status: 401 }
      );
    }

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
      message: "Voucher has been deleted.",
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/voucher",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
