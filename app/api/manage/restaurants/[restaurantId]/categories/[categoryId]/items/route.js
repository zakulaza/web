// app/api/manage/restaurants/[restaurantId]/categories/[categoryId]/items/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../auth/[...nextauth]/route'; // 6 рівнів
import prisma from '@/lib/prisma'; // ПРАВИЛЬНО

// --- GET: Отримати товари для конкретної категорії ---
export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    const restaurantId = parseInt(params.restaurantId);
    const categoryId = parseInt(params.categoryId);

    // Перевірка авторизації та ID
    if (!session?.user?.email || session.user.role !== 'OWNER' || isNaN(restaurantId) || isNaN(categoryId)) {
        return NextResponse.json({ error: 'Unauthorized or Invalid IDs' }, { status: 401 });
    }

    try {
        // Перевіряємо, чи ця категорія належить ресторану власника
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                restaurantId: restaurantId,
                restaurant: {
                    owner: { email: session.user.email }, // Перевірка власника
                },
            },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found or access denied' }, { status: 404 });
        }

        // Отримуємо товари (страви) цієї категорії
        const dishes = await prisma.dish.findMany({
            where: {
                categoryId: categoryId,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(dishes, { status: 200 });

    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- POST: Створити новий товар для категорії ---
export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    const restaurantId = parseInt(params.restaurantId);
    const categoryId = parseInt(params.categoryId);

    if (!session?.user?.email || session.user.role !== 'OWNER' || isNaN(restaurantId) || isNaN(categoryId)) {
        return NextResponse.json({ error: 'Unauthorized or Invalid IDs' }, { status: 401 });
    }

    try {
        // Перевіряємо, чи ця категорія належить ресторану власника
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                restaurantId: restaurantId,
                restaurant: {
                    owner: { email: session.user.email },
                },
            },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found or access denied' }, { status: 404 });
        }

        // Отримуємо дані з тіла запиту
        const data = await request.json();
        if (!data.name || data.price === undefined) {
            return NextResponse.json({ error: 'Item name and price are required' }, { status: 400 });
        }

        // Створюємо новий товар (страву)
        const newDish = await prisma.dish.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price), // Важливо: перетворюємо на число
                calories: data.calories ? parseInt(data.calories) : null, // Калорії необов'язкові
                imageUrl: data.imageUrl,
                categoryId: categoryId, // Прив'язуємо до категорії
            },
        });

        return NextResponse.json(newDish, { status: 201 });

    } catch (error) {
        console.error('Error creating item:', error);
        // Додайте обробку помилки P2002, якщо назва страви має бути унікальною в межах категорії
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}