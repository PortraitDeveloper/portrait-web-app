import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prisma initial
const prisma = new PrismaClient();

// Create data
export async function POST(request) {
  try {
    // Read the body data
    const body = await request.json();

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

    // Create orders_book_dev data
    await prisma.orders_book_dev.create({
      data: {
        book_id: body.book_id,
        book_ref: body.book_ref,
        created_at: currentDate,
        updated_at: null,
        booking_start: body.booking_start,
        booking_end: body.booking_end,
        cust_name: body.cust_name,
        email: body.email,
        phone_number: body.phone_number,
        product_name: body.product_name,
        number_of_add_person: body.number_of_add_person,
        number_of_add_pets: body.number_of_add_pets,
        number_of_add_print_5r: body.number_of_add_print_5r,
        is_add_softfile: body.is_add_softfile,
        voucher_code: body.voucher_code,
        branch_id: body.branch_id,
      },
    });

    // Convert booking_start and booking_end datetime  ISO 8601 format in WIB or Asia/Jakarta Timezone
    // const bookingStart = body.booking_start.concat(":00Z");
    // const bookingEnd = body.booking_end.concat(":00Z");

    const bookingStart = new Date(body.booking_start);
    bookingStart.setHours(bookingStart.getHours() + 7);

    const bookingEnd = new Date(body.booking_end);
    bookingEnd.setHours(bookingEnd.getHours() + 7);

    // Read customer data
    let customer = await prisma.customers.findFirst({
      where: {
        email: body.email,
      },
    });
    console.log("customer:", customer);

    // Check if customer doesn't exist
    if (!customer) {
      // Create new customer data
      customer = await prisma.customers.create({
        data: {
          cust_name: body.cust_name,
          email: body.email,
          phone_number: body.phone_number,
        },
      });
    }

    // Fix product_name string
    const productName = body.product_name.toLowerCase().split("  ");
    console.log("product_name:", productName[0]);

    // Read product data
    const product = await prisma.products.findFirst({
      where: {
        product_name: productName[0],
        branch_id: body.branch_id,
      },
    });
    console.log("product:", product);

    // Convert to integer
    const numberOfAddPerson = parseInt(body.number_of_add_person);
    const numberOfAddPets = parseInt(body.number_of_add_pets);
    const numberOfAddPrint5R = parseInt(body.number_of_add_print_5r);

    // Convert to boolean
    const isAddSoftfile = body.is_add_softfile === "true" ? true : false;

    // Convert to integer
    const numberOfAddSoftfile = isAddSoftfile === true ? 1 : 0;

    // Check voucher_code, if empty string then null
    const voucherCode = body.voucher_code === "" ? null : body.voucher_code;

    // Check if voucherCode not null then read voucher data
    let voucher = null;
    if (voucherCode) {
      // Check whether the voucher has been used or not
      const voucherUsed = await prisma.orders_book.findFirst({
        where: {
          cust_id: customer.cust_id,
          voucher_code: voucherCode,
        },
      });

      // If the voucher has never been used then retrieve the voucher data
      if (!voucherUsed) {
        voucher = await prisma.vouchers.findFirst({
          where: {
            voucher_code: voucherCode,
          },
        });
      }
    }
    console.log("voucher:", voucher);

    // Provides status whether the voucher can be used or not
    let isVoucherApplied = false;
    if (voucher) {
      if (currentDate < voucher.expired_date && !voucher.is_voucher_used) {
        isVoucherApplied = true;
      }
    }

    // Read additionals data
    const additionals = await prisma.additionals.findMany();
    console.log("additionals:", additionals);

    // Total price initial
    let totalPrice = null;

    // Determine whether the print5R is color or black&white
    const foundIndex = productName[0].indexOf("black&white");
    const n = foundIndex !== -1 ? 3 : 2;

    // Total price calculation
    totalPrice =
      product.product_price +
      numberOfAddPerson * additionals[0].item_price +
      numberOfAddPets * additionals[1].item_price +
      numberOfAddPrint5R * additionals[n].item_price +
      numberOfAddSoftfile * additionals[4].item_price;
    console.log("totalPrice:", totalPrice);

    let totalPaidByCust = totalPrice;

    // Check if the voucher can be used and has not been used yet
    if (isVoucherApplied) {
      if (voucher.percentage_discount) {
        // Calculate the total price with a percentage discount
        totalPaidByCust = totalPrice * (1.0 - voucher.percentage_discount);
      } else {
        // Calculate the total price with a nominal discount (if available)
        totalPaidByCust =
          totalPrice -
          (voucher.nominal_discount === null ? 0 : voucher.nominal_discount);
      }
    }
    console.log("totalPaidByCust:", totalPaidByCust);

    // Create orders_book data
    const newData = await prisma.orders_book.create({
      data: {
        book_id: body.book_id,
        book_ref: body.book_ref,
        created_at: currentDate,
        updated_at: null,
        booking_start: bookingStart,
        booking_end: bookingEnd,
        cust_id: customer.cust_id,
        product_id: product.product_id,
        number_of_add_person: numberOfAddPerson,
        number_of_add_pets: numberOfAddPets,
        number_of_add_print_5r: numberOfAddPrint5R,
        is_add_softfile: isAddSoftfile,
        voucher_code: voucherCode,
        is_voucher_applied: isVoucherApplied,
        total_price: totalPrice,
        total_paid_by_cust: totalPaidByCust,
        book_status: "booked",
        payment_status: "unpaid",
      },
    });

    console.log(currentDate, "Status: 201, Data Inserted");
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    const _currentDate = new Date();
    _currentDate.setHours(_currentDate.getHours() + 7);
    console.log(
      _currentDate,
      "Status: 500, An error occurred while processing the request"
    );
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
