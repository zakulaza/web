// app/api/manage/restaurants/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '../../../../lib/prisma';

// Функція GET для отримання ресторанів поточного власника
export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== 'OWNER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const owner = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!owner) {
            return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
        }

        const restaurants = await prisma.restaurant.findMany({
            where: {
                ownerId: owner.id,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(restaurants, { status: 200 });

    } catch (error) {
        console.error('Error fetching owner restaurants:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Функція POST для створення нового ресторану
export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== 'OWNER') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const owner = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!owner) {
            return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
        }

        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Restaurant name is required' }, { status: 400 });
        }

        const newRestaurant = await prisma.restaurant.create({
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                ownerId: owner.id,
            },
        });

        return NextResponse.json(newRestaurant, { status: 201 });

    } catch (error) {
        console.error('Error creating restaurant:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Restaurant with this name already exists' }, { status: 409 });
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}