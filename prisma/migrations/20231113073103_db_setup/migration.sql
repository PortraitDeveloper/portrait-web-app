-- CreateTable
CREATE TABLE "branches" (
    "branch_id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_address" TEXT
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_price" INTEGER NOT NULL,
    "product_desc" TEXT,
    "branch_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "products_history" (
    "history_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name_old" TEXT NOT NULL,
    "product_price_old" TEXT NOT NULL,
    "product_desc_old" TEXT NOT NULL,
    "product_name_new" TEXT NOT NULL,
    "product_price_new" TEXT NOT NULL,
    "product_desc_new" TEXT,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "additionals" (
    "item_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_price" INTEGER NOT NULL,
    "item_desc" TEXT
);

-- CreateTable
CREATE TABLE "vouchers" (
    "voucher_code" TEXT NOT NULL,
    "percentage_discount" DOUBLE PRECISION,
    "nominal_discount" INTEGER,
    "start_date" TIMESTAMP(3),
    "expired_date" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "customers" (
    "cust_id" SERIAL NOT NULL,
    "cust_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("cust_id")
);

-- CreateTable
CREATE TABLE "orders_book" (
    "book_id" TEXT NOT NULL,
    "book_ref" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "booking_start" TIMESTAMP(3) NOT NULL,
    "booking_end" TIMESTAMP(3) NOT NULL,
    "cust_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "number_of_add_person" INTEGER NOT NULL DEFAULT 0,
    "number_of_add_pets" INTEGER NOT NULL DEFAULT 0,
    "number_of_add_print_5r" INTEGER NOT NULL DEFAULT 0,
    "is_add_softfile" BOOLEAN NOT NULL DEFAULT false,
    "voucher_code" TEXT,
    "is_voucher_applied" BOOLEAN NOT NULL DEFAULT false,
    "total_price" INTEGER NOT NULL DEFAULT 0,
    "total_paid_by_cust" INTEGER NOT NULL DEFAULT 0,
    "book_status" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "orders_book_dev" (
    "book_id" TEXT NOT NULL,
    "book_ref" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "booking_start" TEXT NOT NULL,
    "booking_end" TEXT NOT NULL,
    "cust_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "number_of_add_person" TEXT NOT NULL,
    "number_of_add_pets" TEXT NOT NULL,
    "number_of_add_print_5r" TEXT NOT NULL,
    "is_add_softfile" TEXT NOT NULL,
    "voucher_code" TEXT,
    "branch_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_branch_id_key" ON "branches"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_id_key" ON "products"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_history_history_id_key" ON "products_history"("history_id");

-- CreateIndex
CREATE UNIQUE INDEX "additionals_item_id_key" ON "additionals"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_voucher_code_key" ON "vouchers"("voucher_code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_number_key" ON "customers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "orders_book_book_id_key" ON "orders_book"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_book_book_ref_key" ON "orders_book"("book_ref");

-- CreateIndex
CREATE UNIQUE INDEX "orders_book_dev_book_id_key" ON "orders_book_dev"("book_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_history" ADD CONSTRAINT "products_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_book" ADD CONSTRAINT "orders_book_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "customers"("cust_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_book" ADD CONSTRAINT "orders_book_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;