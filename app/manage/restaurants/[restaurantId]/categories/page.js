// app/manage/restaurants/[restaurantId]/categories/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AddCategoryModal from '../../../../components/AddCategoryModal';
import { ChevronLeft, Plus, Settings, Trash2, User } from 'lucide-react'; // Переконайтесь, що User тут є

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.restaurantId;

    useEffect(() => {
        if (status === 'authenticated' && restaurantId) {
            const apiUrl = `/api/manage/restaurants/${restaurantId}/categories`;
            fetch(apiUrl)
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
            // TODO: Fetch restaurant details to get the name
        }
    }, [status, restaurantId, router]);

    const handleCategoryAdded = (newCategory) => {
        setCategories((prev) => [...prev, newCategory]);
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
                restaurantId={restaurantId}
            />

            <main className="pageContainer menuPageContainer">
                <div className="manageContentWrapper">
                    <header className="manageHeader">
                        <div className="manageHeaderTitle"><h1>MANAGER MODE</h1></div>
                        <div className="manageHeaderUser">
              <span className="profileIcon">
                 {/* Тепер іконка User буде відображатися */}
                  {session?.user?.image ? (
                      <img src={session.user.image} alt="profile" className="headerProfileImage small" />
                  ) : (
                      <User size={22} strokeWidth={2.5} />
                  )}
               </span>
                        </div>
                    </header>

                    <section className="manageSection">
                        <div className="manageSectionHeader">
                            <div>
                                <Link href="/manage/restaurants" className="manageBackButton">
                                    <ChevronLeft size={16} style={{ display:'inline-block', marginRight: '0.25rem', verticalAlign: 'middle', marginTop: '-2px'}}/>
                                    Manage Restaurants
                                </Link>
                                <h2>Manage Categories for {restaurantName || `Restaurant #${restaurantId}`}</h2>
                                <p>Add, edit, or delete categories for this menu</p>
                            </div>
                            <button className="manageAddButton" onClick={() => setIsModalOpen(true)}>
                                <Plus size={18} strokeWidth={3} style={{ marginRight: '0.5rem', verticalAlign: 'middle', marginTop: '-2px' }} />
                                Add Category
                            </button>
                        </div>

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
                                            <Link
                                                href={`/manage/restaurants/${restaurantId}/categories/${category.id}/items`}
                                                className="manageMenuButton"
                                            >
                                                Manage Items
                                            </Link>
                                            <button className="actionIcon"><Settings size={20} /></button>
                                            <button className="actionIcon"><Trash2 size={20} /></button>
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