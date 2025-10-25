// app/api/dishes/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // ПРАВИЛЬНО



// --- 1. Функція для ОТРИМАННЯ страв (GET) ---
export async function GET(request) {
    try {
        // Отримуємо параметр 'category' з URL
        const { searchParams } = new URL(request.url);
        const categoryName = searchParams.get('category');

        if (!categoryName) {
            return NextResponse.json(
                { error: 'Category parameter is required' },
                { status: 400 }
            );
        }

        // Знаходимо всі страви, що належать до цієї категорії
        const dishes = await prisma.dish.findMany({
            where: {
                category: {
                    name: categoryName,
                },
            },
        });

        return NextResponse.json(dishes, { status: 200 });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// --- 2. Функція для СТВОРЕННЯ нової страви (POST) ---
export async function POST(request) {
    try {
        const data = await request.json();

        // data має містити name, price, categoryId і т.д.

        const newDish = await prisma.dish.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                calories: parseInt(data.calories),
                imageUrl: data.imageUrl,
                categoryId: parseInt(data.categoryId), // Важливо передати ID категорії
            },
        });

        return NextResponse.json(newDish, { status: 201 }); // 201 Created

    } catch (error)
    {
        console.error('Failed to create dish:', error);
        return NextResponse.json(
            { error: 'Failed to create dish' },
            { status: 500 }
        );
    }
}