import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import is8601Format from "@/utils/iso8601Format";
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
    const body = await request.json();

    // Create orders_book_dev data
    await prisma.raw_data.create({
      data: {
        book_id: body.book_id,
        book_code: body.book_code,
        created_at: currentTimeStamp,
        booking_start: body.booking_start,
        booking_end: body.booking_end,
        cust_name: body.cust_name,
        email: body.email,
        phone_number: body.phone_number,
        product_name: body.product_name,
        number_of_add_person: body.number_of_add_person,
        number_of_add_pet: body.number_of_add_pet,
        number_of_add_print5r: body.number_of_add_print5r,
        is_add_softfile: body.is_add_softfile,
        voucher_code: body.voucher_code,
        branch_id: body.branch_id,
      },
    });

    // Convert booking_start and booking_end datetime ISO 8601 format in WIB or Asia/Jakarta Timezone
    // const bookingStart = body.booking_start.concat(":00Z");
    // const bookingEnd = body.booking_end.concat(":00Z");
    const bookingStart = is8601Format(timeDiff, body.booking_start);
    const bookingEnd = is8601Format(timeDiff, body.booking_end);

    // Read customer data
    let customer = await prisma.customers.findFirst({
      where: {
        cust_name: body.cust_name,
        email: body.email,
        phone_number: body.phone_number,
      },
    });
    // console.log("customer:", customer);

    // Check if customer doesn't exist
    if (!customer) {
      // If customer data doesn't exist then create new customer data
      customer = await prisma.customers.create({
        data: {
          cust_name: body.cust_name,
          email: body.email,
          phone_number: body.phone_number,
        },
      });
    }

    // Fix product_name string
    const productNameArray = body.product_name.toLowerCase().split("  ");
    const productName = productNameArray[0];
    // console.log("product_name:", productName);

    // Read product data
    const product = await prisma.products.findFirst({
      where: {
        product_name: productName,
        branch_id: body.branch_id,
      },
    });
    // console.log("product:", product);

    // Convert to integer
    const numberOfAddPerson = parseInt(body.number_of_add_person);
    const numberOfAddPets = parseInt(body.number_of_add_pet);
    const numberOfAddPrint5R = parseInt(body.number_of_add_print5r);

    // Convert to boolean
    let isAddSoftfile = body.is_add_softfile === "yes";

    // Set number of softfile based on boolean value
    const numberOfAddSoftfile =
      isAddSoftfile && productName !== "blue room" ? 1 : 0;

    // If product name is blue room then number of softfile is 0
    if (productName === "blue room") {
      isAddSoftfile = false;
    }

    // Check voucher_code, if empty string then null
    const voucherCode = body.voucher_code === "" ? null : body.voucher_code;

    // Check if voucherCode not null then read voucher data
    let voucher = null;
    if (voucherCode) {
      // Check whether the voucher has been used or not
      const voucherUsed = await prisma.orders_book.findFirst({
        where: {
          cust_id: customer.cust_id,
          transactions: {
            voucher_code: voucherCode,
          },
        },
      });
      // console.log("voucherUsed:", voucherUsed);

      // If the voucher has never been used then retrieve the voucher data
      if (!voucherUsed) {
        voucher = await prisma.vouchers.findFirst({
          where: {
            voucher_code: voucherCode,
          },
        });
      }
    }
    // console.log("voucher:", voucher);

    // Provides status whether the voucher can be used or not
    let isVoucherApplied = false;
    if (voucher) {
      if (currentTimeStamp < voucher.expired_date && !voucher.is_voucher_used) {
        isVoucherApplied = true;
      }
    }

    // Read additionals data
    const additionals = await prisma.additionals.findMany();
    // console.log("additionals:", additionals);

    // Determine whether the print5R is color or black&white
    const foundIndex = productName.indexOf("black&white");
    const n = foundIndex !== -1 ? 2 : 3;
    // console.log("n:", n);

    // Additionals Price List Calculation
    const additionalPersonPrice = numberOfAddPerson * additionals[0].item_price;
    const additionalPetPrice = numberOfAddPets * additionals[1].item_price;
    const additionalPrint5r = numberOfAddPrint5R * additionals[n].item_price;
    const additionalSoftfile = numberOfAddSoftfile * additionals[4].item_price;

    // Total price initial
    let totalPrice = null;

    // Total price calculation
    totalPrice =
      product.product_price +
      additionalPersonPrice +
      additionalPetPrice +
      additionalPrint5r +
      additionalSoftfile;
    // console.log("totalPrice:", totalPrice);

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
    // console.log("totalPaidByCust:", totalPaidByCust);

    // Create transactions data
    await prisma.transactions.create({
      data: {
        book_code: body.book_code,
        created_at: currentTimeStamp,
        updated_at: null,
        product_price: product.product_price,
        additional_person_price: additionalPersonPrice,
        additional_pet_price: additionalPetPrice,
        additional_print5r_price: additionalPrint5r,
        additional_softfile_price: additionalSoftfile,
        total_price: totalPrice,
        voucher_code: voucherCode,
        is_voucher_applied: isVoucherApplied,
        total_paid_by_cust: totalPaidByCust,
        payment_url: null,
        payment_status: "unpaid",
      },
    });

    // Create orders_book data
    const newData = await prisma.orders_book.create({
      data: {
        book_id: body.book_id,
        book_code: body.book_code,
        created_at: currentTimeStamp,
        updated_at: null,
        booking_start: bookingStart,
        booking_end: bookingEnd,
        cust_id: customer.cust_id,
        product_id: product.product_id,
        number_of_add_person: numberOfAddPerson,
        number_of_add_pet: numberOfAddPets,
        number_of_add_print5r: numberOfAddPrint5R,
        is_add_softfile: isAddSoftfile,
        book_status: "booked",
      },
    });

    console.log(
      currentTimeStamp,
      "Status: 201",
      "New order book data inserted."
    );

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/order/book",
      status: 201,
      message: "New order book data inserted.",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/order/book",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
