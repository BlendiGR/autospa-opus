"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { ActionResult } from "@/lib/action-result";

/** Plain invoice type for client components */
export type UnassignedInvoice = {
  id: number;
  plate: string;
  services: string[];
  totalAmount: number;
  createdAt: Date;
};

/**
 * Fetches all invoices that are not linked to a customer.
 */
export async function getUnassignedInvoices(): Promise<ActionResult<UnassignedInvoice[]>> {
  try {
    await requireAuth();

    const invoices = await prisma.invoices.findMany({
      where: {
        customerId: null,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        plate: true,
        items: {
          select: {
            service: true,
          },
        },
        totalAmount: true,
        createdAt: true,
      },
    });

    // Convert Decimal to number for client consumption
    const data = invoices.map((inv) => ({
      ...inv,
      services: inv.items.map((i) => i.service),
      totalAmount: Number(inv.totalAmount),
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch unassigned invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

