// prisma/seed.js
console.log('!!! DEBUG: seed.js script is starting !!!');
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // --- Чистимо старі дані ---
    await prisma.dish.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Cleaned existing data.');


    // --- 1. Створюємо Власника ---
    const hashedPasswordOwner = await bcrypt.hash('123456', 10);
    const owner = await prisma.user.create({
        data: {
            email: 'owner@nazva.com',
            password: hashedPasswordOwner,
            role: Role.OWNER,
            name: 'Restaurant Owner',
        },
    });
    console.log(`Created owner: ${owner.email}`);

    // --- 2. Створюємо Клієнта ---
    const hashedPasswordCustomer = await bcrypt.hash('password', 10);
    const customer = await prisma.user.create({
        data: {
            email: 'customer@test.com',
            password: hashedPasswordCustomer,
            role: Role.CUSTOMER,
            name: 'Test Customer',
        },
    });
    console.log(`Created customer: ${customer.email}`);

    // --- 3. Створюємо Ресторан "NAZVA" ---
    const restaurantNazva = await prisma.restaurant.create({
        data: {
            name: 'NAZVA',
            description: 'A warm and welcoming place for coffee lovers',
            imageUrl: '/images/restaurant_nazva.jpg',
            ownerId: owner.id,
        },
    });
    console.log(`Created restaurant: ${restaurantNazva.name}`);

    // --- 4. Створюємо Категорії для "NAZVA" ---
    const categoryHotDishes = await prisma.category.create({ data: { name: 'Гарячі страви', restaurantId: restaurantNazva.id } });
    const categorySoups = await prisma.category.create({ data: { name: 'Супи', restaurantId: restaurantNazva.id } });
    const categorySalads = await prisma.category.create({ data: { name: 'Салати', restaurantId: restaurantNazva.id } });
    const categoryPizza = await prisma.category.create({ data: { name: 'Піца', restaurantId: restaurantNazva.id } });
    const categoryDesserts = await prisma.category.create({ data: { name: 'Десерти', restaurantId: restaurantNazva.id } });
    const categoryAlcohol = await prisma.category.create({ data: { name: 'Алкогольні напої', restaurantId: restaurantNazva.id } });
    const categoryNonAlcohol = await prisma.category.create({ data: { name: 'Безалкогольні напої', restaurantId: restaurantNazva.id } });
    const categoryCoffee = await prisma.category.create({ data: { name: 'Кава', restaurantId: restaurantNazva.id } });
    const categoryTea = await prisma.category.create({ data: { name: 'Чай', restaurantId: restaurantNazva.id } });
    console.log('Created categories for NAZVA');

    // --- 5. Створюємо ДУЖЕ БАГАТО Страв для "NAZVA" ---
    await prisma.dish.createMany({
        data: [
            // Гарячі страви
            { name: 'Котлета по-київськи', description: '200г, з картопляним пюре', price: 220.0, calories: 550, imageUrl: '/images/kiev.jpg', categoryId: categoryHotDishes.id },
            { name: 'Вареники з картоплею та грибами', description: '250г, зі шкварками та сметаною', price: 130.0, calories: 480, imageUrl: '/images/varenyky_mush.jpg', categoryId: categoryHotDishes.id },
            { name: 'Деруни з м\'ясом', description: '280г, зі сметаною', price: 160.0, calories: 520, imageUrl: '/images/deruny_meat.jpg', categoryId: categoryHotDishes.id },
            { name: 'Стейк Рібай', description: '300г, з овочами гриль', price: 450.0, calories: 600, imageUrl: '/images/ribeye.jpg', categoryId: categoryHotDishes.id },
            { name: 'Лосось на грилі', description: '180г, з рисом та соусом теріякі', price: 350.0, calories: 420, imageUrl: '/images/salmon.jpg', categoryId: categoryHotDishes.id },
            { name: 'Паста Карбонара', description: '350г', price: 210.0, calories: 650, imageUrl: '/images/carbonara.jpg', categoryId: categoryHotDishes.id },

            // Супи
            { name: 'Борщ Український', description: '350мл, зі сметаною, пампушками та часником', price: 150.0, calories: 320, imageUrl: '/images/borsch.jpg', categoryId: categorySoups.id },
            { name: 'Солянка м\'ясна', description: '350мл', price: 170.0, calories: 400, imageUrl: '/images/solyanka.jpg', categoryId: categorySoups.id },
            { name: 'Грибний крем-суп', description: '300мл, з грінками', price: 130.0, calories: 280, imageUrl: '/images/mush_soup.jpg', categoryId: categorySoups.id },

            // Салати
            { name: 'Салат Цезар з куркою', description: '250г', price: 180.0, calories: 380, imageUrl: '/images/caesar.jpg', categoryId: categorySalads.id },
            { name: 'Грецький салат', description: '300г', price: 160.0, calories: 300, imageUrl: '/images/greek.jpg', categoryId: categorySalads.id },
            { name: 'Салат з телятиною та руколою', description: '220г', price: 230.0, calories: 350, imageUrl: '/images/beef_salad.jpg', categoryId: categorySalads.id },
            { name: 'Салат Олів\'є', description: '250г', price: 140.0, calories: 420, imageUrl: '/images/olivier.jpg', categoryId: categorySalads.id },

            // Піца
            { name: 'Піца Маргарита', description: '30см', price: 190.0, calories: 800, imageUrl: '/images/margarita.jpg', categoryId: categoryPizza.id },
            { name: 'Піца Пепероні', description: '30см', price: 230.0, calories: 950, imageUrl: '/images/pepperoni.jpg', categoryId: categoryPizza.id },
            { name: 'Піца 4 Сири', description: '30см', price: 250.0, calories: 1000, imageUrl: '/images/4cheese.jpg', categoryId: categoryPizza.id },

            // Десерти
            { name: 'Наполеон', description: '150г', price: 90.0, calories: 500, imageUrl: '/images/napoleon.jpg', categoryId: categoryDesserts.id },
            { name: 'Чізкейк Нью-Йорк', description: '140г', price: 110.0, calories: 480, imageUrl: '/images/cheesecake.jpg', categoryId: categoryDesserts.id },
            { name: 'Шоколадний фондан', description: '120г, з кулькою морозива', price: 130.0, calories: 550, imageUrl: '/images/fondant.jpg', categoryId: categoryDesserts.id },
            { name: 'Тирамісу', description: '130г', price: 120.0, calories: 450, imageUrl: '/images/tiramisu.jpg', categoryId: categoryDesserts.id },

            // Кава
            { name: 'Кава "Dristachino"', description: 'Особливий рецепт', price: 80.0, calories: 120, imageUrl: '/images/coffee.jpg', categoryId: categoryCoffee.id },
            { name: 'Еспресо', description: '30мл', price: 50.0, calories: 5, imageUrl: '/images/espresso.jpg', categoryId: categoryCoffee.id },
            { name: 'Американо', description: '150мл', price: 55.0, calories: 10, imageUrl: '/images/americano.jpg', categoryId: categoryCoffee.id },
            { name: 'Капучино', description: '200мл', price: 65.0, calories: 120, imageUrl: '/images/cappuccino.jpg', categoryId: categoryCoffee.id },
            { name: 'Лате', description: '250мл', price: 70.0, calories: 150, imageUrl: '/images/latte.jpg', categoryId: categoryCoffee.id },

            // Чай
            { name: 'Чай чорний', description: '400мл', price: 50.0, calories: 0, imageUrl: '/images/black_tea.jpg', categoryId: categoryTea.id },
            { name: 'Чай зелений', description: '400мл', price: 50.0, calories: 0, imageUrl: '/images/green_tea.jpg', categoryId: categoryTea.id },
            { name: 'Чай фруктовий', description: '400мл', price: 60.0, calories: 10, imageUrl: '/images/fruit_tea.jpg', categoryId: categoryTea.id },

            // Безалкогольні напої
            { name: 'Лимонад класичний', description: '300мл', price: 60.0, calories: 100, imageUrl: '/images/lemonade.jpg', categoryId: categoryNonAlcohol.id },
            { name: 'Мохіто б/а', description: '350мл', price: 80.0, calories: 120, imageUrl: '/images/mojito_na.jpg', categoryId: categoryNonAlcohol.id },
            { name: 'Сік апельсиновий фреш', description: '250мл', price: 75.0, calories: 110, imageUrl: '/images/oj_fresh.jpg', categoryId: categoryNonAlcohol.id },
            { name: 'Coca-Cola', description: '330мл', price: 45.0, calories: 140, imageUrl: '/images/coke.jpg', categoryId: categoryNonAlcohol.id },

            // Алкогольні напої (приклади)
            { name: 'Пиво світле "NAZVA"', description: '0.5л', price: 80.0, calories: 200, imageUrl: '/images/beer.jpg', categoryId: categoryAlcohol.id },
            { name: 'Вино червоне сухе', description: '150мл', price: 120.0, calories: 125, imageUrl: '/images/red_wine.jpg', categoryId: categoryAlcohol.id },
            { name: 'Коктейль "Мохіто"', description: '300мл', price: 160.0, calories: 180, imageUrl: '/images/mojito.jpg', categoryId: categoryAlcohol.id },
        ]
    });
    console.log('Created A LOT of dishes for NAZVA');

    console.log('Seeding finished.');
}

main()
    .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });