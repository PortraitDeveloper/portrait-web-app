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
CREATE TABLE "transactions" (
    "book_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "product_price" INTEGER NOT NULL,
    "additional_person_price" INTEGER NOT NULL DEFAULT 0,
    "additional_pet_price" INTEGER NOT NULL DEFAULT 0,
    "additional_print5r_price" INTEGER NOT NULL DEFAULT 0,
    "additional_softfile_price" INTEGER NOT NULL DEFAULT 0,
    "total_price" INTEGER NOT NULL DEFAULT 0,
    "voucher_code" TEXT,
    "is_voucher_applied" BOOLEAN NOT NULL DEFAULT false,
    "total_paid_by_cust" INTEGER NOT NULL DEFAULT 0,
    "payment_status" TEXT NOT NULL,
    "payment_url" TEXT
);

-- CreateTable
CREATE TABLE "orders_book" (
    "book_id" TEXT NOT NULL,
    "book_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "booking_date" TEXT NOT NULL,
    "start_at" TEXT NOT NULL,
    "end_at" TEXT NOT NULL,
    "cust_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "number_of_add_person" INTEGER NOT NULL DEFAULT 0,
    "number_of_add_pet" INTEGER NOT NULL DEFAULT 0,
    "number_of_add_print5r" INTEGER NOT NULL DEFAULT 0,
    "is_add_softfile" BOOLEAN NOT NULL DEFAULT false,
    "book_status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "raw_data" (
    "book_id" TEXT NOT NULL,
    "book_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "booking_date" TEXT NOT NULL,
    "start_at" TEXT NOT NULL,
    "end_at" TEXT NOT NULL,
    "cust_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "number_of_add_person" TEXT NOT NULL,
    "number_of_add_pet" TEXT NOT NULL,
    "number_of_add_print5r" TEXT NOT NULL,
    "is_add_softfile" TEXT NOT NULL,
    "voucher_code" TEXT,
    "branch_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "transactions_book_code_key" ON "transactions"("book_code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_book_book_id_key" ON "orders_book"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_book_book_code_key" ON "orders_book"("book_code");

-- CreateIndex
CREATE UNIQUE INDEX "raw_data_book_id_key" ON "raw_data"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_history" ADD CONSTRAINT "products_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_book" ADD CONSTRAINT "orders_book_book_code_fkey" FOREIGN KEY ("book_code") REFERENCES "transactions"("book_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_book" ADD CONSTRAINT "orders_book_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "customers"("cust_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_book" ADD CONSTRAINT "orders_book_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
