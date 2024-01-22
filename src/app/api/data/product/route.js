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
        route:
          "/api/data/product",
        status: 401,
        message: "Suspicious request, not authorized to create data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to create this data" },
        { status: 401 }
      );
    }

    // Read the body data
    const { product_name, product_price, product_desc, branch_id } =
      await request.json();

    if (!product_name || !product_price || branch_id === "null") {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "All fields are required to be filled in",
      });
    }

    const productPrice = parseInt(product_price);

    if (productPrice <= 0) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Invalid product price",
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
        product_price: productPrice,
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
        route:
          "/api/data/product",
        status: 401,
        message: "Suspicious request, not authorized to alter data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to alter this data" },
        { status: 401 }
      );
    }

    // Read the body data
    const { product_id, product_name, product_price, product_desc, branch_id } =
      await request.json();

    if (!product_price) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Product price must be filled in",
      });
    }

    const productPrice = parseInt(product_price);

    if (productPrice <= 0) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Invalid product price",
      });
    }

    const existingData = await prisma.products.findFirst({
      where: {
        product_id,
        product_name,
        product_price: productPrice,
        product_desc,
        branch_id,
      },
    });

    if (existingData) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product",
        status: 400,
        message: "Product data already exist",
      });
    }

    // Update the product data
    const newData = await prisma.products.update({
      where: { product_id, branch_id },
      data: { product_name, product_price: productPrice, product_desc },
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
        route:
          "/api/data/product",
        status: 401,
        message: "Suspicious request, not authorized to delete data",
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to delete this data" },
        { status: 401 }
      );
    }

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
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
