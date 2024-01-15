import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Set Timeout 5s
const timeOut = 7000;

// Set default url
const url = "https://theportraitplace.my.id/checkout?book_id=";

export async function POST(request) {
  // Delay
  await new Promise((resolve) => setTimeout(resolve, timeOut));

  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { bookid } = await request.json();

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

      if (!rawData) {
        const log = {
          created_at: currentTimeStamp,
          route: "/api/data/book",
          status: 404,
          message: "Raw data not found.",
        };
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
        const productNameArray = rawData.product_name.split("  ");
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

        let dataFiltered = additionals.filter(
          (item) => item.item_id === "it-1"
        );
        console.log("Data Filtered:", dataFiltered)

        const personPrice = dataFiltered[0].item_price;
        console.log("PersonPrice:", personPrice);

        dataFiltered = additionals.filter((item) => item.item_id === "it-2");
        const petPrice = dataFiltered[0].item_price;
        console.log("PetPrice:", petPrice);

        // Determine whether the print5R is color or black&white
        const foundIndex = productName.indexOf("Black and White");
        const itemId = foundIndex !== -1 ? "lt-3" : "lt-4";
        dataFiltered = additionals.filter((item) => item.item_id === itemId);
        const print5RPrice = dataFiltered[0].item_price;
        console.log("Print5r Price:", print5RPrice);

        dataFiltered = additionals.filter((item) => item.item_id === "it-5");
        const softfilePrice = dataFiltered[0].item_price;
        console.log("SoftFile:", softfilePrice);

        // Additionals Price List Calculation
        const additionalPersonPrice = numberOfAddPerson * parseInt(personPrice);
        const additionalPetPrice = numberOfAddPets * parseInt(petPrice);
        const additionalPrint5r = numberOfAddPrint5R * parseInt(print5RPrice);
        const additionalSoftfile =
          numberOfAddSoftfile * parseInt(softfilePrice);

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

        // Generate checkout url
        const checkoutUrl = url.concat(rawData.book_id);

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
            checkout_url: checkoutUrl,
            payment_url: null,
            payment_status: "unpaid",
          },
        });

        // Create order book data
        await prisma.orders_book.create({
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

        const returnData = await prisma.orders_book.findUnique({
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
          data: returnData,
        });
      }
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
