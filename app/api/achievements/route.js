// app/api/achievements/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Переконайтесь, що шлях правильний
import prisma from '../../../lib/prisma';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    // 1. Перевірка безпеки: чи користувач залогінений?
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Отримуємо ID користувача (перетворюємо, бо сесія зберігає його як string)
        const userId = parseInt(session.user.id, 10);

        // 3. Запит до БД: знайти всі UserAchievement для цього userId
        // І включити (include) пов'язані дані з моделі Achievement
        const userAchievements = await prisma.userAchievement.findMany({
            where: {
                userId: userId,
            },
            include: {
                achievement: true, // Включаємо дані ачівки (назва, опис, іконка)
            },
            orderBy: {
                createdAt: 'desc', // Показуємо останні отримані першими
            }
        });

        // 4. Повертаємо лише потрібні дані
        const achievements = userAchievements.map(ua => ua.achievement);

        return NextResponse.json(achievements, { status: 200 });

    } catch (error) {
        console.error("Error fetching achievements:", error);
        return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
    }
}