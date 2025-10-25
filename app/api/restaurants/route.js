// app/api/restaurants/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';


// Функція GET для отримання ВСІХ ресторанів
export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            // Ми також можемо додати сюди інформацію про власника, якщо потрібно
            // include: {
            //   owner: true,
            // },
        });
        return NextResponse.json(restaurants, { status: 200 });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}