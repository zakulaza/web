// app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react'; // Для іконки профілю

export default function LandingPage() {
    const [restaurants, setRestaurants] = useState([]);

    // Завантажуємо ресторани при відкритті сторінки
    useEffect(() => {
        fetch('/api/restaurants')
            .then((res) => res.json())
            .then((data) => {
                setRestaurants(data);
            });
    }, []);

    return (
        // pageContainer + menuPageContainer
        <main className="w-full min-h-screen flex flex-col bg-white">
            {/* landingContentWrapper */}
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-8">
                
                {/* --- Хедер --- */}
                {/* landingHeader */}
                <header className="flex justify-between items-center py-6 sm:py-8">
                    {/* landingLogo */}
                    <span className="font-bold text-xl sm:text-2xl text-black">Breadcrump</span>
                    {/* landingNav */}
                    <div className="flex items-center gap-6">
                        {/* landingLoginBtn */}
                        <Link href="/login" className="text-gray-700 font-medium text-base hover:text-gray-900 transition">
                            Вхід
                        </Link>
                        {/* profileIcon */}
                        <span className="text-xl text-gray-600">
                           <User size={20} />
                        </span>
                    </div>
                </header>

                {/* --- Секція QR-коду (greenBanner) --- */}
                <section className="mb-8 sm:mb-16 bg-green-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 flex justify-between items-center text-white gap-6 flex-wrap">
                    {/* bannerText */}
                    <div className="flex-1 min-w-[300px]">
                        <h2 className="text-2xl sm:text-3xl font-bold m-0 mb-4">QR-код для ресторанів</h2>
                        <p className="text-base m-0 mb-6 opacity-90">Підключіть заклад</p>
                        <div className="flex flex-wrap gap-3">
                            {/* bannerBtn light */}
                            <Link href="#" className="no-underline px-4 py-2.5 rounded-full font-bold border border-white bg-white text-green-600 inline-block transition hover:bg-gray-100">
                                Підключити заклад
                            </Link>
                            {/* bannerBtn dark */}
                            <Link href="/login?role=owner" className="no-underline px-4 py-2.5 rounded-full font-bold border border-white bg-transparent text-white inline-block transition hover:bg-white/10">
                                Увійти в кабінет
                            </Link>
                        </div>
                    </div>
                    {/* bannerImage */}
                    <div className="w-32 h-40 sm:w-40 sm:h-52 bg-white/20 rounded-lg flex-shrink-0 m-4 sm:m-0 mx-auto">
                        {/* заглушка зображення */}
                    </div>
                </section>

                {/* --- Секція "Establishments" (Список ресторанів) --- */}
                <section className="mb-8 sm:mb-16">
                    {/* sectionHeader */}
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                        <h3 className="m-0 text-xl sm:text-2xl font-semibold text-black">Establishments</h3>
                        {/* seeAllLink */}
                        <Link href="#" className="no-underline text-blue-600 font-medium text-sm hover:underline">
                            Переглянути всі
                        </Link>
                    </div>
                    {/* establishmentsGrid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Array.isArray(restaurants) &&
                            restaurants.map((restaurant) => (
                                <Link
                                    href={`/restaurant/${restaurant.id}`} // Динамічне посилання!
                                    key={restaurant.id}
                                    className="block no-underline text-gray-800 transition transform hover:-translate-y-1"
                                >
                                    {/* restaurantImage */}
                                    <div className="relative w-full pb-[60%] bg-gray-200 rounded-xl overflow-hidden mb-3">
                                        <Image
                                            src={restaurant.imageUrl || '/images/placeholder.jpg'}
                                            alt={restaurant.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="m-0 mb-0.5 text-lg font-semibold truncate">{restaurant.name}</h4>
                                    <p className="m-0 mb-2 text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>
                                    {/* restaurantRating */}
                                    <span className="text-sm text-yellow-500">★★★★☆</span>
                                </Link>
                            ))}
                    </div>
                </section>

                {/* --- Секція "Як це все працює" (greenBanner) --- */}
                <section className="mb-8 sm:mb-16 bg-green-600 rounded-xl sm:rounded-2xl p-6 sm:p-10 flex justify-between items-center text-white gap-6 flex-wrap">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-bold m-0 mb-4">Як це все працює насправді?</h2>
                        <Link href="#" className="no-underline px-4 py-2.5 rounded-full font-bold border border-white bg-white text-green-600 inline-block transition hover:bg-gray-100">
                            Дізнатися
                        </Link>
                    </div>
                    <div className="w-32 h-40 sm:w-40 sm:h-52 bg-white/20 rounded-lg flex-shrink-0 m-4 sm:m-0 mx-auto">
                        {/* заглушка зображення */}
                    </div>
                </section>

                {/* --- Футер --- */}
                <footer className="border-t border-gray-200 py-6 sm:py-8 flex justify-between text-gray-500 flex-wrap gap-8 w-full">
                    <span className="landingLogo text-sm font-bold text-gray-800">Breadcrump</span>
                    {/* footerLinks */}
                    <div className="flex gap-6 sm:gap-12 flex-wrap">
                        <div className="flex-1 min-w-[150px]">
                            <strong className="text-gray-800 block mb-1.5 text-sm">Продукт</strong>
                            {/* ... */}
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <strong className="text-gray-800 block mb-1.5 text-sm">Партнерство</strong>
                            {/* ... */}
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <strong className="text-gray-800 block mb-1.5 text-sm">Контакти</strong>
                            <p className="m-0 text-sm">+380XXXXXXX</p>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}