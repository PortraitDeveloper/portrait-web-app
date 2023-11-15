import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Prisma initial
const prisma = new PrismaClient();

// Read data
export async function GET(request, { params: { bookid } }) {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 7);
  console.log("bookingid:", bookid);

  try {
    const orderBook = await prisma.orders_book.findUnique({
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
    console.log(orderBook);

    // if not found, return 404 error
    if (!orderBook) {
      console.log(currentDate, "Status: 404, Data not found");
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    } else {
      // Else return data
      console.log(currentDate, "Status: 200, Data found");
      return NextResponse.json(orderBook, { status: 200 });
    }
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
