// app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
        // Використовуємо .pageContainer, щоб сторінка була білою
        <main className="pageContainer menuPageContainer">
            {/* Обгортка, яка обмежує ширину контенту */}
            <div className="landingContentWrapper">
                {/* --- Хедер --- */}
                <header className="landingHeader">
                    <span className="landingLogo">Breadcrump</span>
                    <div className="landingNav">
                        {/* ЗМІНА 1: Видаляємо посилання з хедера. Залишаємо просто текст або видаляємо.
                           Я залишаю текст 'Вхід' для відповідності скріншоту.
                        */}
                        <span className="landingLoginBtn">

                        </span>
                        <span className="profileIcon"> </span>
                    </div>
                </header>

                {/* --- Секція QR-коду --- */}
                <section className="landingSection greenBanner">
                    <div className="bannerText">
                        <h2>QR-код для ресторанів</h2>
                        <p>Підключіть заклад</p>
                        <div>
                            <Link href="#" className="bannerBtn light">
                                Підключити заклад
                            </Link>
                            {/* ЗМІНА 2: Додаємо посилання на вхід для власників до кнопки "Увійти в кабінет" */}
                            <Link href="/login?role=owner" className="bannerBtn dark">
                                Увійти в кабінет
                            </Link>
                        </div>
                    </div>
                    <div className="bannerImage">
                        {/* */}
                    </div>
                </section>

                {/* --- Секція "Recently visited" (якщо є) --- */}
                <section className="landingSection">
                    <h3>Recently visited</h3>
                    <div className="recentlyVisited">
                        {/* Сюди можна додати логіку */}
                    </div>
                </section>

                {/* --- Секція "Establishments" (Список ресторанів) --- */}
                <section className="landingSection">
                    <div className="sectionHeader">
                        <h3>Establishments</h3>
                        <Link href="#" className="seeAllLink">
                            Переглянути всі
                        </Link>
                    </div>
                    <div className="establishmentsGrid">
                        {Array.isArray(restaurants) &&
                            restaurants.map((restaurant) => (
                                <Link
                                    href={`/menu/${restaurant.id}`} // Динамічне посилання!
                                    key={restaurant.id}
                                    className="restaurantCard"
                                >
                                    <div className="restaurantImage">
                                        <Image
                                            src={restaurant.imageUrl || '/images/placeholder.jpg'}
                                            alt={restaurant.name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <h4>{restaurant.name}</h4>
                                    <p>{restaurant.description}</p>
                                    <span className="restaurantRating">★★★★☆</span>
                                </Link>
                            ))}
                    </div>
                </section>

                {/* --- Секція "Як це все працює" --- */}
                <section className="landingSection greenBanner">
                    <div className="bannerText">
                        <h2>Як це все працює насправді?</h2>
                        <Link href="#" className="bannerBtn light">
                            Дізнатися
                        </Link>
                    </div>
                    <div className="bannerImage">
                        {/* */}
                    </div>
                </section>

                {/* --- Футер --- */}
                <footer className="landingFooter">
                    <span className="landingLogo">Breadcrump</span>
                    <div className="footerLinks">
                        <div>
                            <strong>Продукт</strong>
                            {/* ... */}
                        </div>
                        <div>
                            <strong>Партнерство</strong>
                            {/* ... */}
                        </div>
                        <div>
                            <strong>Контакти</strong>
                            <p>+380XXXXXXX</p>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}