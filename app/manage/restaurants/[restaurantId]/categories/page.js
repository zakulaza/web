// app/manage/restaurants/[restaurantId]/categories/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation'; // Для отримання ID з URL
import Link from 'next/link';
import AddCategoryModal from '../../../../components/AddCategoryModal'; // Імпортуємо модалку

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [restaurantName, setRestaurantName] = useState(''); // Щоб показати назву ресторану
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, status } = useSession();
    const params = useParams(); // Отримуємо параметри з URL ({ restaurantId: '...' })
    const router = useRouter(); // Для кнопки "Назад"
    const restaurantId = params.restaurantId;

    // Завантажуємо категорії для цього restaurantId
    useEffect(() => {
        if (status === 'authenticated' && restaurantId) {
            const apiUrl = `/api/manage/restaurants/${restaurantId}/categories`;
            fetch(apiUrl)
                .then((res) => {
                    if (!res.ok) {
                        // Можливо, ресторан не знайдено або немає доступу
                        if (res.status === 404 || res.status === 401) {
                            router.push('/manage/restaurants'); // Повертаємо на список ресторанів
                        }
                        throw new Error('Failed to fetch categories');
                    }
                    return res.json();
                })
                .then((data) => {
                    setCategories(data);
                    // TODO: Отримати назву ресторану окремим запитом або передати її
                    // setRestaurantName(data.restaurant.name); // Поки що закоментовано
                })
                .catch((error) => {
                    console.error('Error fetching categories:', error);
                });
        }
    }, [status, restaurantId, router]);

    const handleCategoryAdded = (newCategory) => {
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    };

    if (status === 'loading') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }
    if (status === 'unauthenticated') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Доступ заборонено.</div></main>;
    }

    return (
        <>
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryAdded={handleCategoryAdded}
                restaurantId={restaurantId} // Передаємо ID ресторану в модалку
            />

            <main className="pageContainer menuPageContainer">
                <div className="manageContentWrapper">
                    <header className="manageHeader">
                        {/* ... (хедер адмінки) ... */}
                    </header>

                    <section className="manageSection">
                        <div className="manageSectionHeader">
                            <div>
                                {/* Кнопка "Назад" */}
                                <Link href="/manage/restaurants" className="manageBackButton">
                                    ← Manage Restaurants
                                </Link>
                                {/* Назва ресторану (поки статична) */}
                                <h2>Manage Categories for {restaurantName || `Restaurant #${restaurantId}`}</h2>
                                <p>Add, edit, or delete categories for this menu</p>
                            </div>
                            <button
                                className="manageAddButton"
                                onClick={() => setIsModalOpen(true)}
                            >
                                + Add Category
                            </button>
                        </div>

                        {/* Список категорій */}
                        <div className="manageCategoryList">
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((category) => (
                                    <div key={category.id} className="manageCategoryCard">
                                        <div className="manageCategoryInfo">
                                            <h3>{category.name}</h3>
                                            <p>{category.description || 'No description'}</p>
                                            <span>{/* TODO: Кількість страв */} items</span>
                                        </div>
                                        <div className="manageCategoryActions">
                                            {/* Посилання на керування стравами цієї категорії */}
                                            <Link
                                                href={`/manage/restaurants/${restaurantId}/categories/${category.id}/items`}
                                                className="manageMenuButton" // Використовуємо той самий стиль
                                            >
                                                Manage Items
                                            </Link>
                                            <span className="actionIcon">⚙️</span>
                                            <span className="actionIcon">🗑️</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="noDataText">No categories added yet for this restaurant.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}