// app/manage/restaurants/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Для отримання сесії на клієнті
import Link from 'next/link';
import Image from 'next/image';

export default function ManageRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const { data: session, status } = useSession(); // Отримуємо сесію

    // Завантажуємо ресторани власника при завантаженні сторінки
    useEffect(() => {
        // Завантажуємо тільки якщо сесія завантажена і користувач автентифікований
        if (status === 'authenticated') {
            fetch('/api/manage/restaurants') // Використовуємо новий API
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch restaurants');
                    }
                    return res.json();
                })
                .then((data) => {
                    setRestaurants(data);
                })
                .catch((error) => {
                    console.error('Error fetching restaurants:', error);
                    // Можна показати повідомлення про помилку користувачу
                });
        }
    }, [status]); // Ефект спрацює, коли зміниться статус сесії

    // Показуємо завантаження, поки сесія перевіряється
    if (status === 'loading') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }

    // Якщо користувач не автентифікований (хоча middleware мав би це обробити)
    if (status === 'unauthenticated') {
        // Можна перенаправити або показати повідомлення
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Доступ заборонено.</div></main>;
    }


    return (
        <main className="pageContainer menuPageContainer">
            {/* Обгортка для контенту адмін-панелі */}
            <div className="manageContentWrapper">
                {/* Хедер Адмін-панелі */}
                <header className="manageHeader">
                    <div className="manageHeaderTitle">
                        <h1>MANAGER MODE</h1>
                        {/* Можливо, посилання "Назад" або "Вийти" */}
                    </div>
                    <div className="manageHeaderUser">
                        <span className="profileIcon">👤</span>
                        {/* Тут може бути email власника: session?.user?.email */}
                    </div>
                </header>

                {/* Секція "My Restaurants" */}
                <section className="manageSection">
                    <div className="manageSectionHeader">
                        <div>
                            <h2>My Restaurants</h2>
                            <p>Manage your restaurants and menus</p>
                        </div>
                        {/* Кнопка додавання (поки що без функціоналу) */}
                        <button className="manageAddButton">
                            + Add Restaurant
                        </button>
                    </div>

                    {/* Список ресторанів власника */}
                    <div className="manageRestaurantList">
                        {Array.isArray(restaurants) && restaurants.length > 0 ? (
                            restaurants.map((restaurant) => (
                                <div key={restaurant.id} className="manageRestaurantCard">
                                    <div className="manageRestaurantImage">
                                        <Image
                                            src={restaurant.imageUrl || '/images/placeholder.jpg'}
                                            alt={restaurant.name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="manageRestaurantInfo">
                                        <h3>{restaurant.name}</h3>
                                        <p>{restaurant.description || 'No description'}</p>
                                        <div className="manageRestaurantStats">
                                            <span><strong>{/* TODO */}</strong> Categories</span>
                                            <span><strong>{restaurant.orders?.length || 0}</strong> Orders</span>
                                            <span><strong>${/* TODO */}</strong> Revenue</span>
                                        </div>
                                    </div>
                                    <div className="manageRestaurantActions">
                                        {/* Іконки редагування, видалення */}
                                        <span className="actionIcon">⚙️</span>
                                        <span className="actionIcon">🗑️</span>
                                        {/* Посилання на керування меню цього ресторану */}
                                        <Link
                                            href={`/manage/restaurants/${restaurant.id}/categories`}
                                            className="manageMenuButton"
                                        >
                                            MENAGE MENU
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="noDataText">You haven't added any restaurants yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}