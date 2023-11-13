import { useEffect } from "react";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

// Prisma initial
const prisma = new PrismaClient();

export default function Checkout() {
  const [data, setData] = useState({});
  const router = useRouter();
  const { book_id } = router.query;

  useEffect(() => {
    const readOrdersBook = async () => {
      try {
        const getData = await prisma.orders_book.findFirst({
          where: {
            book_id: book_id,
          },
        });
        setData(getData);
        return NextResponse.json(getData, { status: 201 });
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
    };

    readOrdersBook();
  }, []);

  return (
    <>
      <h1>Checkout Page</h1>
      <p>{data}</p>
    </>
  );
}
