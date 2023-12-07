import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read all product data
    const products = await prisma.products.findMany({
      include: {
        branches: true,
      },
    });

    // Return all product data
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 200,
      message: "Products data found.",
      data: products,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 500,
      message: error,
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
    const { product_name, product_price, product_desc, branch_id } =
      await request.json();

    // Check whether the product data already exists
    const product = await prisma.products.findFirst({
      where: {
        product_name,
        branch_id,
      },
    });

    // If product data already exists then return an error log
    if (product) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Product data already exists.",
      };
      return NextResponse.json(log);
    } else {
      // Generate a product ID
      const rowCount = await prisma.products.count();
      const rowNumber = rowCount + 1;
      const product_id = `pr-${rowNumber}`;

      // Create a new product data
      const newData = await prisma.products.create({
        data: {
          product_id,
          product_name,
          product_price,
          product_desc,
          branches: {
            connect: {
              branch_id,
            },
          },
        },
      });

      // Return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 201,
        message: "Product data inserted.",
        data: newData,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 500,
      message: error,
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
    const { product_id, product_name, product_price, product_desc, branch_id } =
      await request.json();

    // Update the product data
    const newData = await prisma.products.update({
      where: { product_id },
      data: { product_name, product_price, product_desc, branch_id },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 200,
      message: "Product data updated.",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 500,
      message: error,
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
    const { product_id } = await request.json();

    // Delete the product data by product ID
    await prisma.products.delete({
      where: { product_id },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/product",
      status: 200,
      message: "Product data has been deleted.",
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: getTimeStamp(timeDiff),
      route: "/api/data/product",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
