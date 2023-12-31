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
    // Read all products data
    const products = await prisma.products.findMany({
      include: {
        branches: true,
      },
    });

    // Return all products data
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
    const { product_name, product_price, product_desc, branch_id } =
      await request.json();

    if (!product_name || !product_price || branch_id === "null") {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "The product name, price, and branch ID must be filled in",
      });
    }

    // Check whether the product data already exists
    const product = await prisma.products.findFirst({
      where: {
        product_name,
        branch_id,
      },
    });

    // If product data already exists then return an error log
    if (product) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Product data already exists.",
      });
    }

    // Generate a product ID
    const rowCount = await prisma.products.count();
    const rowNumber = rowCount + 1;
    const product_id = `pr-${rowNumber}`;

    // Create a new product data
    const newData = await prisma.products.create({
      data: {
        product_id,
        product_name,
        product_price: parseInt(product_price),
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
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product",
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
    const { product_id, product_name, product_price, product_desc, branch_id } =
      await request.json();

    if (parseInt(product_price) === 0) {
      // Return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "The product price cannot be zero",
      });
    }

    const existingData = await prisma.products.findFirst({
      where: {
        OR: [
          { product_id, product_name, product_price, product_desc, branch_id },
          { product_name, branch_id },
        ],
      },
    });

    if (existingData) {
      // Return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Product data already exist",
      });
    }

    // Update the product data
    const newData = await prisma.products.update({
      where: { product_id },
      data: { product_name, product_price, product_desc },
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
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
