import type { Decimal } from "@prisma/client/runtime/library"

export interface Product {
    id: number
    name: string
    description?: string | null
    price: Decimal
    stock: number
    imageUrl?: string | null
    createdAt?: Date
    updatedAt?: Date
}

export interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}