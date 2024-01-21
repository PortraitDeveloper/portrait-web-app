export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/access",
    "/dashboard/backoffice/transaction",
    "/dashboard/backoffice/product",
    "/dashboard/backoffice/additional",
    "/dashboard/backoffice/voucher",
    "/dashboard/operator/transaction",
  ],
};
