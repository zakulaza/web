// app/api/manage/restaurants/[restaurantId]/categories/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import prisma from '../../../../../../lib/prisma';

// --- GET: Отримати категорії для конкретного ресторану ---
export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    const restaurantId = parseInt(params.restaurantId); // Отримуємо ID ресторану з URL

    // Перевірка авторизації та ID
    if (!session?.user?.email || session.user.role !== 'OWNER' || isNaN(restaurantId)) {
        return NextResponse.json({ error: 'Unauthorized or Invalid ID' }, { status: 401 });
    }

    try {
        // Перевіряємо, чи цей ресторан належить поточному власнику
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                owner: { email: session.user.email }, // Перевірка власника
            },
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found or access denied' }, { status: 404 });
        }

        // Отримуємо категорії цього ресторану
        const categories = await prisma.category.findMany({
            where: {
                restaurantId: restaurantId,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(categories, { status: 200 });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- POST: Створити нову категорію для ресторану ---
export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    const restaurantId = parseInt(params.restaurantId);

    if (!session?.user?.email || session.user.role !== 'OWNER' || isNaN(restaurantId)) {
        return NextResponse.json({ error: 'Unauthorized or Invalid ID' }, { status: 401 });
    }

    try {
        // Перевіряємо, чи цей ресторан належить поточному власнику
        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                owner: { email: session.user.email },
            },
        });

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found or access denied' }, { status: 404 });
        }

        // Отримуємо дані з тіла запиту
        const data = await request.json();
        if (!data.name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        // Створюємо нову категорію
        const newCategory = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
                restaurantId: restaurantId, // Прив'язуємо до ресторану
            },
        });

        return NextResponse.json(newCategory, { status: 201 });

    } catch (error) {
        console.error('Error creating category:', error);
        if (error.code === 'P2002') { // Перевірка на унікальність (якщо потрібно)
            return NextResponse.json({ error: 'Category with this name already exists in this restaurant' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}