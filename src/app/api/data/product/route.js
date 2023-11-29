import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function GET(request) {
  try {
    const products = await prisma.products.findMany();

    console.log(
      currentTimeStamp,
      "status: 200",
      "message: Data found",
      products
    );
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 200,
      message: "Data found",
      data: products,
    });
  } catch (error) {
    console.log(currentTimeStamp, "Status: 500", error);
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 500,
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
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
    console.log("Product:", product);

    if (product) {
      console.log(
        currentTimeStamp,
        "status: 400",
        "error: Data already exists"
      );
      return NextResponse.json({
        created_at: currentTimeStamp,
        status: 400,
        error: "Data already exists",
      });
    } else {
      // Generate product ID
      const rowCount = await prisma.products.count();
      const rowNumber = rowCount + 1;
      const product_id = `pr-${rowNumber}`;
      console.log("product_id:", product_id);

      // Create data
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

      console.log(
        currentTimeStamp,
        "status: 201",
        "message: Data inserted",
        newData
      );
      return NextResponse.json({
        created_at: currentTimeStamp,
        status: 201,
        message: "Data inserted",
        data: newData,
      });
    }
  } catch (error) {
    console.log(currentTimeStamp, "Status: 500", error);
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 500,
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    // Read the body data
    const { product_id, product_name, product_price, product_desc, branch_id } =
      await request.json();

    const newData = await prisma.products.update({
      where: { product_id },
      data: { product_name, product_price, product_desc, branch_id },
    });

    console.log(
      currentTimeStamp,
      "status: 200",
      "message: Data updated",
      newData
    );
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 200,
      message: "Data updated",
      data: newData,
    });
  } catch (error) {
    console.log(currentTimeStamp, "Status: 500", error);
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 500,
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    // Read the body data
    const { product_id } = await request.json();

    await prisma.products.delete({
      where: { product_id },
    });

    console.log(currentTimeStamp, "status: 200", "message: Data deleted");
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 200,
      message: "Data deleted",
    });
  } catch (error) {
    console.log(currentTimeStamp, "Status: 500", error);
    return NextResponse.json({
      created_at: currentTimeStamp,
      status: 500,
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
}
