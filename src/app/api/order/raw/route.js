import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Create data
export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const {
      book_id,
      book_code,
      booking_date,
      start_at,
      end_at,
      cust_name,
      email,
      phone_number,
      product_name,
      number_of_add_person,
      number_of_add_pet,
      number_of_add_print5r,
      is_add_softfile,
      voucher_code,
      branch_id,
    } = await request.json();

    // Create raw order book data
    const newData = await prisma.raw_data.create({
      data: {
        book_id: book_id,
        book_code: book_code,
        created_at: currentTimeStamp,
        booking_date: booking_date,
        start_at: start_at,
        end_at: end_at,
        cust_name: cust_name,
        email: email,
        phone_number: phone_number,
        product_name: product_name,
        number_of_add_person: number_of_add_person,
        number_of_add_pet: number_of_add_pet,
        number_of_add_print5r: number_of_add_print5r,
        is_add_softfile: is_add_softfile,
        voucher_code: voucher_code,
        branch_id: branch_id,
      },
    });

    // Return success log and new data
    console.log(currentTimeStamp, "Status: 201", "New raw data inserted.");

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/order/book",
      status: 201,
      message: "New raw data inserted.",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/order/book",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
