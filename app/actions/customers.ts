"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/prisma/prisma";
import { jobSchema, JobFormData } from "@/lib/schemas/jobSchema";
import { customerInvoiceSchema, CustomerInvoiceFormData } from "@/lib/schemas/customerInvoiceSchema";
import { CUSTOMERS_PER_PAGE, VAT_RATE } from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import type { Customer } from "@/app/generated/prisma/client";

type CustomersData = {
  customers: Customer[];
  totalCount: number;
  totalPages: number;
};

/**
 * Fetches a paginated list of customers.
 */
export async function getCustomers({
  page = 1,
  limit = CUSTOMERS_PER_PAGE,
}: { page?: number; limit?: number } = {}): Promise<ActionResult<CustomersData>> {
  try {
    await requireAuth();

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.customer.count(),
    ]);

    return {
      success: true,
      data: {
        customers,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch {
    return { success: false, error: "Failed to fetch customers" };
  }
}

/**
 * Fetches a customer by ID.
 */
export async function getCustomerById(id: number): Promise<ActionResult<Customer>> {
  try {
    await requireAuth();

    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      return { success: false, error: "Customer not found" };
    }

    return { success: true, data: customer };
  } catch {
    return { success: false, error: "Failed to fetch customer" };
  }
}

/**
 * Adds a new tyre storage job for a customer.
 *
 * @param customerId - The customer ID to link the job to
 * @param data - Job form data (plate, number, location)
 * @returns Object indicating success/failure
 */
export async function addJobToCustomer(customerId: number, data: JobFormData) {
  try {
    await requireAuth();

    const validatedData = jobSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }

    await prisma.tyre.create({
      data: {
        plate: validatedData.data.plate.toUpperCase(),
        number: validatedData.data.number,
        location: validatedData.data.location,
        customerId: customerId,
        dateStored: new Date(),
        isStored: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/customers/${customerId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "A tyre with this plate already exists" };
    }
    return { success: false, error: "Failed to create job" };
  }
}

/**
 * Adds a new invoice for a customer.
 *
 * @param customerId - The customer ID to link the invoice to
 * @param data - Invoice form data (plate, items with service/price)
 * @returns Object indicating success/failure
 */
export async function addInvoiceToCustomer(customerId: number, data: CustomerInvoiceFormData) {
  try {
    await requireAuth();

    const validatedData = customerInvoiceSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }

    // Calculate totals
    const services = validatedData.data.items.map((item) => item.service);
    const subtotal = validatedData.data.items.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    const tax = subtotal * VAT_RATE;
    const total = subtotal + tax;

    await prisma.invoices.create({
      data: {
        plate: validatedData.data.plate.toUpperCase(),
        services: services,
        totalAmount: total,
        totalTax: tax,
        customerId: customerId,
      },
    });

    revalidatePath(`/customers/${customerId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create invoice" };
  }
}