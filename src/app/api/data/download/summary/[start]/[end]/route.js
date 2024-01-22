import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { start, end } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route:
          "/api/data/download/summary/[start]/[end]",
        status: 401,
        message: "Suspicious request, not authorized to get data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    // Search data
    const data = await prisma.$queryRaw`SELECT 
    orders_book.created_at, 
    orders_book.book_code, 
    customers.cust_name,
    customers.phone_number,
    customers.email,
    branches.branch_name,
    orders_book.booking_date,
    orders_book.start_at,
    products.product_name,
    orders_book.number_of_add_person,
    orders_book.number_of_add_pet,
    orders_book.number_of_add_print5r,
    orders_book.is_add_softfile,
    transactions.product_price,
    transactions.additional_person_price,
    transactions.additional_pet_price,
    transactions.additional_print5r_price,
    transactions.additional_softfile_price,
    transactions.total_price AS subtotal,
    transactions.voucher_code,
    transactions.is_voucher_applied,
    transactions.total_paid_by_cust AS total,
    transactions.prev_total,
    transactions.price_diff,
    orders_book.book_status,
    transactions.payment_status
    FROM orders_book 
    INNER JOIN transactions ON orders_book.book_code = transactions.book_code
    INNER JOIN customers ON orders_book.cust_id = customers.cust_id
    INNER JOIN products ON orders_book.product_id = products.product_id
    INNER JOIN branches ON products.branch_id = branches.branch_id
    WHERE orders_book.booking_date BETWEEN ${start} AND ${end}
    ORDER BY orders_book.booking_date ASC`;

    // Check whether data exists or not
    if (!data || data.length === 0) {
      // If data not found then return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/download/summary/[start]/[end]",
        status: 400,
        message: "Gagal mengunduh, data tidak ditemukan",
      });
    } else {
      // If data found then return data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/download/summary/[start]/[end]",
        status: 200,
        message: "Data berhasil diunduh",
        data: data,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/download/summary/[start]/[end]",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
