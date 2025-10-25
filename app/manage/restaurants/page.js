// app/manage/restaurants/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import AddRestaurantModal from '../../components/AddRestaurantModal'; // Імпортуємо модалку

export default function ManageRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const { data: session, status } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модалки

    // Завантажуємо ресторани власника
    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/manage/restaurants')
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
                });
        }
    }, [status]);

    // Функція для оновлення списку після додавання
    const handleRestaurantAdded = (newRestaurant) => {
        setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
    };

    // Показуємо завантаження
    if (status === 'loading') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }

    // Доступ заборонено (хоча middleware мав би це обробити)
    if (status === 'unauthenticated') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Доступ заборонено.</div></main>;
    }

    return (
        <>
            {/* Модальне вікно для додавання */}
            <AddRestaurantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRestaurantAdded={handleRestaurantAdded}
            />

            {/* Основний контент сторінки */}
            <main className="pageContainer menuPageContainer">
                <div className="manageContentWrapper">
                    {/* Хедер Адмін-панелі */}
                    <header className="manageHeader">
                        <div className="manageHeaderTitle">
                            <h1>MANAGER MODE</h1>
                        </div>
                        <div className="manageHeaderUser">
                            <span className="profileIcon">👤</span>
                            {/* Можна вивести email власника */}
                            {/* <span>{session?.user?.email}</span> */}
                        </div>
                    </header>

                    {/* Секція "My Restaurants" */}
                    <section className="manageSection">
                        <div className="manageSectionHeader">
                            <div>
                                <h2>My Restaurants</h2>
                                <p>Manage your restaurants and menus</p>
                            </div>
                            {/* Кнопка відкриває модалку */}
                            <button
                                className="manageAddButton"
                                onClick={() => setIsModalOpen(true)}
                            >
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
                                            <span className="actionIcon">⚙️</span>
                                            <span className="actionIcon">🗑️</span>
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
        </>
    );
}