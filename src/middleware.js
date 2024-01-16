export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/transaction",
    "/dashboard/product",
    "/dashboard/prototype",
  ],
};
