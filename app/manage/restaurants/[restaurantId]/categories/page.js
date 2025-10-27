// app/manage/restaurants/[restaurantId]/categories/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AddCategoryModal from '../../../../components/AddCategoryModal';
import { ChevronLeft, Plus, Settings, Trash2, User } from 'lucide-react';
import Image from 'next/image'; // Необхідний для тега <Image>

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    // Використовуємо .tsx синтаксис для безпеки, але .js файл вимагає видалення 'as string'
    const restaurantId = params.restaurantId;

    useEffect(() => {
        if (status === 'authenticated' && restaurantId) {
            // 1. Завантаження категорій
            const fetchCategories = fetch(`/api/manage/restaurants/${restaurantId}/categories`)
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 404 || res.status === 401) {
                            router.push('/manage/restaurants');
                        }
                        throw new Error('Failed to fetch categories');
                    }
                    return res.json();
                })
                .then(setCategories)
                .catch(console.error);

            // 2. Завантаження назви ресторану
            const fetchRestaurantDetails = fetch(`/api/manage/restaurants/${restaurantId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.name) {
                        setRestaurantName(data.name);
                    }
                })
                .catch(console.error);

            // Об'єднуємо обидва запити (хоча category API може повертати назву)
            Promise.all([fetchCategories, fetchRestaurantDetails]);
        }
    }, [status, restaurantId, router]);

    const handleCategoryAdded = (newCategory) => {
        setCategories((prev) => [...prev, newCategory]);
    };

    // TODO: Обробка видалення (аналогічно як у ManageItemsPage)
    // const handleDeleteCategory = () => { /* ... */ };


    if (status === 'loading') {
        // pageContainer + menuPageContainer + loadingText
        return <main className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100"><div className="p-8 text-center text-gray-500">Завантаження...</div></main>;
    }
    if (status === 'unauthenticated') {
        // pageContainer + menuPageContainer + loadingText
        return <main className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100"><div className="p-8 text-center text-gray-500">Доступ заборонено.</div></main>;
    }

    return (
        <>
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryAdded={handleCategoryAdded}
                restaurantId={restaurantId}
            />

            {/* pageContainer + menuPageContainer */}
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                {/* manageContentWrapper */}
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8">
                    
                    {/* manageHeader */}
                    <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 flex-wrap gap-4">
                        <div className="manageHeaderTitle">
                            <h1 className="m-0 text-sm font-semibold tracking-wider text-gray-600 uppercase">MANAGER MODE</h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                           {/* profileIcon */}
                           {session?.user?.image ? (
                                <img src={session.user.image} alt="profile" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                                <User size={22} strokeWidth={2.5} className="text-gray-500"/>
                            )}
                        </div>
                    </header>

                    {/* manageSection */}
                    <section className="mb-8 sm:mb-12">
                        <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                            <div>
                                {/* manageBackButton */}
                                <Link href="/manage/restaurants" className="inline-flex items-center text-gray-600 no-underline text-sm mb-1 hover:underline">
                                    <ChevronLeft size={16} className="mr-1" />
                                    Manage Restaurants
                                </Link>
                                
                                <h2><strong className="text-2xl sm:text-3xl font-bold">Manage Categories</strong> for {restaurantName || `Restaurant #${restaurantId}`}</h2>
                                <p className="m-0 text-gray-500 text-base">Add, edit, or delete categories for this menu</p>
                            </div>
                            {/* manageAddButton */}
                            <button className="bg-indigo-600 text-white border-none rounded-lg px-5 py-3 text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap transition hover:bg-indigo-700 flex items-center gap-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus size={18} strokeWidth={3} />
                                Add Category
                            </button>
                        </div>

                        {/* manageCategoryList */}
                        <div className="flex flex-col gap-3">
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((category) => (
                                    // manageCategoryCard
                                    <div key={category.id} className="bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 border border-gray-100">
                                        
                                        {/* manageCategoryInfo */}
                                        <div className="flex-grow text-left overflow-hidden">
                                            <h3 className="m-0 mb-0.5 text-base sm:text-lg font-semibold truncate">{category.name}</h3>
                                            <p className="m-0 mb-1 text-gray-500 text-sm truncate">{category.description || 'No description'}</p>
                                            <span className="text-xs text-gray-400">{category.item_count || 0} items</span>
                                        </div>
                                        
                                        {/* manageCategoryActions */}
                                        <div className="flex items-center gap-3 flex-shrink-0 pt-3 border-t border-gray-100 sm:border-t-0 sm:pt-0">
                                            
                                            {/* Manage Items button */}
                                            <Link
                                                href={`/manage/restaurants/${restaurantId}/categories/${category.id}/items`}
                                                className="bg-gray-100 text-indigo-600 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer no-underline whitespace-nowrap transition hover:bg-gray-200"
                                            >
                                                Manage Items
                                            </Link>

                                            {/* Редагування та Видалення */}
                                            <button className="text-gray-500 transition hover:text-indigo-600">
                                                <Settings size={20} />
                                            </button>
                                            <button className="text-gray-500 transition hover:text-red-500">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // noDataText
                                <p className="text-gray-500 text-center p-8">No categories added yet for this restaurant.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}