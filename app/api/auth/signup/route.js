// Шлях: /app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Вам знадобиться бібліотека для хешування паролів
// npm install bcryptjs
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        // 1. Перевірка, чи всі дані на місці
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // 2. Перевірка, чи юзер вже існує
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 } // 409 Conflict
            );
        }

        // 3. Хешування паролю
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Створення юзера в базі даних Postgres
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: role || 'CUSTOMER', // За замовчуванням 'CUSTOMER'
            },
        });

        // Не повертаємо пароль клієнту
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}