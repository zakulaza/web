// Уявіть, що це ваш API-маршрут для обробки нового замовлення
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ... (код для POST-запиту, що створює замовлення) ...

// ПІСЛЯ того, як замовлення успішно створено:
// Ми запускаємо функцію перевірки ачівок

async function checkAchievements(userId, orderItems) {

    // --- 1. Перевірка на "Coffee Lover" (ID ачівки = 1) ---
    const coffeeItemsInOrder = orderItems.filter(item => item.category === 'Кава').length;

    if (coffeeItemsInOrder > 0) {

        // Перевіряємо, чи є у користувача вже ця ачівка
        const existingAchievement = await prisma.userAchievement.findFirst({
            where: {
                userId: userId,
                achievementId: 1 // Припустимо, ID "Coffee Lover" = 1
            }
        });

        // Якщо ачівки ще немає
        if (!existingAchievement) {
            // Рахуємо, скільки всього кави він замовив за весь час
            const allCoffeeOrders = await prisma.order.count({ // (Це спрощена логіка, вам потрібен детальніший підрахунок)
                where: {
                    userId: userId,
                    // Тут мала б бути перевірка наявності кави у замовленнях
                }
            });

            // Припустимо, потрібно 10 замовлень кави
            if (allCoffeeOrders >= 10) {
                // Створюємо запис!
                await prisma.userAchievement.create({
                    data: {
                        userId: userId,
                        achievementId: 1 // ID "Coffee Lover"
                    }
                });
                console.log(`Користувач ${userId} отримав ачівку "Coffee Lover"!`);
            }
        }
    }

    // --- 2. Перевірка на "Explorer" (ID ачівки = 2) ---
    // ... (схожа логіка для перевірки кількості унікальних ресторанів) ...
}

// Ви викликаєте цю функцію після успішного замовлення:
// await checkAchievements(session.user.id, newOrder.items);