import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { bookid } = await request.json();
    console.log("Book ID (server):", bookid);

    // Read the order book data by book ID
    const existingData = await prisma.orders_book.findUnique({
      where: {
        book_id: bookid,
      },
      include: {
        transactions: true,
        customers: true,
        products: {
          include: {
            branches: true,
          },
        },
      },
    });
    console.log("Existing Data:", existingData);

    if (existingData) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/book",
        status: 200,
        message: "Order book data already exists.",
        data: existingData,
      };
      return NextResponse.json(log);
    } else {
      // Read raw data
      const rawData = await prisma.raw_data.findUnique({
        where: {
          book_id: bookid,
        },
      });
      console.log("Raw Data:", rawData);

      if (!rawData) {
        const log = {
          created_at: currentTimeStamp,
          route: "/api/data/book",
          status: 404,
          message: "Raw data not found.",
        };
        errorLog(log);
        return NextResponse.json(log);
      } else {
        // Read customer data
        let customer = await prisma.customers.findFirst({
          where: {
            cust_name: rawData.cust_name,
            email: rawData.email,
            phone_number: rawData.phone_number,
          },
        });

        // Check if customer doesn't exist
        if (!customer) {
          // If customer data doesn't exist then create new customer data
          customer = await prisma.customers.create({
            data: {
              cust_name: rawData.cust_name,
              email: rawData.email,
              phone_number: rawData.phone_number,
            },
          });
        }

        // Fix product_name string
        const productNameArray = rawData.product_name.toLowerCase().split("  ");
        const productName = productNameArray[0];

        // Read product data
        const product = await prisma.products.findFirst({
          where: {
            product_name: productName,
            branch_id: rawData.branch_id,
          },
        });

        // Convert to integer
        const numberOfAddPerson = parseInt(rawData.number_of_add_person);
        const numberOfAddPets = parseInt(rawData.number_of_add_pet);
        const numberOfAddPrint5R = parseInt(rawData.number_of_add_print5r);

        // Convert to boolean
        let isAddSoftfile = rawData.is_add_softfile === "yes";

        // Set number of softfile based on boolean value
        const numberOfAddSoftfile =
          isAddSoftfile && productName !== "blue room" ? 1 : 0;

        // If product name is blue room then number of softfile is 0
        if (productName === "blue room") {
          isAddSoftfile = false;
        }

        // Check voucher_code, if empty string then null
        const voucherCode =
          rawData.voucher_code === "" ? null : rawData.voucher_code;

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

          // If the voucher has never been used then retrieve the voucher data
          if (!voucherUsed) {
            voucher = await prisma.vouchers.findFirst({
              where: {
                voucher_code: voucherCode,
              },
            });
          }
        }

        // Provides status whether the voucher can be used or not
        let isVoucherApplied = false;
        if (voucher) {
          if (
            currentTimeStamp < voucher.expired_date &&
            !voucher.is_voucher_used
          ) {
            isVoucherApplied = true;
          }
        }

        // Read additionals data
        const additionals = await prisma.additionals.findMany();

        // Determine whether the print5R is color or black&white
        const foundIndex = productName.indexOf("black&white");
        const n = foundIndex !== -1 ? 2 : 3;

        // Additionals Price List Calculation
        const additionalPersonPrice =
          numberOfAddPerson * additionals[0].item_price;
        const additionalPetPrice = numberOfAddPets * additionals[1].item_price;
        const additionalPrint5r =
          numberOfAddPrint5R * additionals[n].item_price;
        const additionalSoftfile =
          numberOfAddSoftfile * additionals[4].item_price;

        // Total price initial
        let totalPrice = null;

        // Total price calculation
        totalPrice =
          product.product_price +
          additionalPersonPrice +
          additionalPetPrice +
          additionalPrint5r +
          additionalSoftfile;

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
              (voucher.nominal_discount === null
                ? 0
                : voucher.nominal_discount);
          }
        }

        // Create transactions data
        await prisma.transactions.create({
          data: {
            book_code: rawData.book_code,
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
            book_id: rawData.book_id,
            book_code: rawData.book_code,
            created_at: currentTimeStamp,
            updated_at: null,
            booking_date: rawData.booking_date,
            start_at: rawData.start_at,
            end_at: rawData.end_at,
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
      }
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book/[bookid]",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
