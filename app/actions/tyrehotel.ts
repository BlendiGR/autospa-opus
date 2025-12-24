"use server";

import { prisma } from "@/prisma/prisma";

const PAGE_SIZE = 12;

export async function fetchTyres(query?: string | null, page: number = 1, isStored=true) {
    const skip = (page - 1) * PAGE_SIZE;
    
    const whereClause = {
        ...(query && {
            OR: [
                { plate: { contains: query, mode: "insensitive" as const } },
                { number: { contains: query, mode: "insensitive" as const } },
                { location: { contains: query, mode: "insensitive" as const } },
                { customer: { name: { contains: query, mode: "insensitive" as const } } },
            ]
        }),
    };

    const [tyres, total] = await Promise.all([
        prisma.tyre.findMany({
            where: {
                ...whereClause,
                isStored: isStored
            },
            include: { customer: true },
            orderBy: { dateStored: 'desc' },
            skip,
            take: PAGE_SIZE
        }),
        prisma.tyre.count({ where: { ...whereClause, isStored: isStored } })
    ]);

    return {
        tyres,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / PAGE_SIZE),
            totalItems: total
        }
    };
}

export async function tyreCounts() {

    const byLocation = await prisma.tyre.groupBy({
        by: ['location'],
        _count: { id: true },
        where: { isStored: true }
    });

    const countsByLocation = byLocation.map(l => ({
        location: l.location ?? 'Unknown',
        count: l._count.id
    }));

    const total = countsByLocation.reduce((acc, l) => acc + l.count, 0);

    return {
        countsByLocation,
        total
    };
}

export async function customerCount() {
    const count = await prisma.customer.count();
    return count;
}

export async function fetchCustomers() {
    const customers = await prisma.customer.findMany({
        select: { id: true, name: true, plate: true },
        orderBy: { name: 'asc' }
    });
    return customers;
}

export async function fetchLocations() {
    const locations = await prisma.tyre.findMany({
        where: { location: { not: null } },
        select: { location: true },
        distinct: ['location']
    });
    return locations.map(l => l.location).filter(Boolean) as string[];
}

interface CreateTyreInput {
    plate: string;
    number: string;
    location: string;
    customerId?: number;
}

export async function createTyre(data: CreateTyreInput) {
    try {
        const tyre = await prisma.tyre.create({
            data: {
                plate: data.plate.toUpperCase(),
                number: data.number,
                location: data.location,
                customerId: data.customerId ?? null,
                dateStored: new Date(),
                isStored: true,
            },
            include: { customer: true }
        });
        return { success: true, tyre };
    } catch (error) {
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return { success: false, error: 'A tyre with this plate already exists' };
        }
        return { success: false, error: 'Failed to create tyre' };
    }
}

export async function toggleTyreStatus(id: number) {
    try {
        const tyre = await prisma.tyre.findUnique({ where: { id } });
        
        if (!tyre) {
            return { success: false, error: 'Tyre not found' };
        }

        const newIsStored = !tyre.isStored;
        
        const updatedTyre = await prisma.tyre.update({
            where: { id },
            data: {
                isStored: newIsStored,
                deletedAt: newIsStored ? null : new Date(),
            },
            include: { customer: true }
        });

        return { success: true, tyre: updatedTyre };
    } catch (error) {
        console.error('Failed to toggle tyre status:', error);
        return { success: false, error: 'Failed to toggle tyre status' };
    }
}