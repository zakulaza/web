// app/manage/restaurants/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import AddRestaurantModal from '../../components/AddRestaurantModal';
import { User, Settings, Trash2, Plus } from 'lucide-react'; // Імпортуємо іконки

export default function ManageRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/manage/restaurants')
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch restaurants');
                    return res.json();
                })
                .then(setRestaurants)
                .catch(console.error);
        }
    }, [status]);

    const handleRestaurantAdded = (newRestaurant) => {
        setRestaurants((prev) => [...prev, newRestaurant]);
    };

    if (status === 'loading') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }
    if (status === 'unauthenticated') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Доступ заборонено.</div></main>;
    }

    return (
        <>
            <AddRestaurantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRestaurantAdded={handleRestaurantAdded}
            />

            <main className="pageContainer menuPageContainer">
                <div className="manageContentWrapper">
                    <header className="manageHeader">
                        <div className="manageHeaderTitle">
                            <h1>MANAGER MODE</h1>
                        </div>
                        <div className="manageHeaderUser">
              <span className="profileIcon">
                {session?.user?.image ? (
                    <img src={session.user.image} alt="profile" className="headerProfileImage small" />
                ) : (
                    <User size={22} strokeWidth={2.5} /> // Заміна 👤
                )}
              </span>
                            {/* Можна додати email <span>{session?.user?.email}</span> */}
                        </div>
                    </header>

                    <section className="manageSection">
                        <div className="manageSectionHeader">
                            <div>
                                <h2>My Restaurants</h2>
                                <p>Manage your restaurants and menus</p>
                            </div>
                            <button className="manageAddButton" onClick={() => setIsModalOpen(true)}>
                                <Plus size={18} strokeWidth={3} style={{ marginRight: '0.5rem', verticalAlign: 'middle', marginTop: '-2px' }} /> {/* Іконка + */}
                                Add Restaurant
                            </button>
                        </div>

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
                                            <button className="actionIcon"><Settings size={20} /></button> {/* Заміна ⚙️ */}
                                            <button className="actionIcon"><Trash2 size={20} /></button> {/* Заміна 🗑️ */}
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