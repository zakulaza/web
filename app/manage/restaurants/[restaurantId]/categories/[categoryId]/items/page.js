// app/manage/restaurants/[restaurantId]/categories/[categoryId]/items/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AddItemModal from '@/components/AddItemModal'; // Абсолютний імпорт
import EditItemModal from '@/components/EditItemModal'; // Абсолютний імпорт
import { ChevronLeft, Plus, Settings, Trash2, User } from 'lucide-react'; // Переконайтесь, що User тут є

export default function ManageItemsPage() {
    const [items, setItems] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const restaurantId = params.restaurantId;
    const categoryId = params.categoryId;

    useEffect(() => {
        if (status === 'authenticated' && restaurantId && categoryId) {
            const apiUrl = `/api/manage/restaurants/${restaurantId}/categories/${categoryId}/items`;
            fetch(apiUrl)
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 404 || res.status === 401) {
                            router.push(`/manage/restaurants/${restaurantId}/categories`);
                        }
                        throw new Error('Failed to fetch items');
                    }
                    return res.json();
                })
                .then(setItems)
                .catch(console.error);
            // TODO: Отримати назву категорії
        }
    }, [status, restaurantId, categoryId, router]);

    const handleItemAdded = (newItem) => {
        setItems((prev) => [...prev, newItem]);
    };

    const openEditModal = (item) => {
        setItemToEdit(item);
        setIsEditModalOpen(true);
    };

    const handleItemUpdated = (updatedItem) => {
        setItems((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        setItemToEdit(null);
    };

    const handleDeleteItem = async (itemId) => {
        // --- 👇 ДОДАНО LOG 👇 ---
        console.log(`Attempting to delete item: restaurantId=${restaurantId}, categoryId=${categoryId}, itemId=${itemId}`);
        // --------------------------
        if (!confirm('Ви впевнені, що хочете видалити цей товар?')) {
            return;
        }

        const apiUrl = `/api/manage/restaurants/${restaurantId}/categories/${categoryId}/items/${itemId}`;
        try {
            const res = await fetch(apiUrl, { method: 'DELETE' });
            if (!res.ok) {
                // Спробуємо прочитати JSON помилку з відповіді
                let errorData = { error: 'Failed to delete item' };
                try {
                    errorData = await res.json();
                } catch (jsonError) {
                    // Якщо відповідь не JSON, використовуємо статус
                    errorData.error = `Server responded with status ${res.status}`;
                }
                throw new Error(errorData.error);
            }
            setItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error('Delete item error:', error);
            alert(`Помилка видалення: ${error.message}`);
        }
    };


    if (status === 'loading') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Завантаження...</div></main>;
    }
    if (status === 'unauthenticated') {
        return <main className="pageContainer menuPageContainer"><div className="loadingText">Доступ заборонено.</div></main>;
    }

    return (
        <>
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onItemAdded={handleItemAdded}
                restaurantId={restaurantId}
                categoryId={categoryId}
            />
            <EditItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onItemUpdated={handleItemUpdated}
                itemToEdit={itemToEdit}
                restaurantId={restaurantId}
                categoryId={categoryId}
            />

            <main className="pageContainer menuPageContainer">
                <div className="manageContentWrapper">
                    <header className="manageHeader">
                        <div className="manageHeaderTitle"><h1>MANAGER MODE</h1></div>
                        <div className="manageHeaderUser">
              <span className="profileIcon">
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
                                <Link href={`/manage/restaurants/${restaurantId}/categories`} className="manageBackButton">
                                    <ChevronLeft size={16} style={{ display:'inline-block', marginRight: '0.25rem', verticalAlign: 'middle', marginTop: '-2px'}}/>
                                    Manage Categories
                                </Link>
                                <h2>Manage Items in {categoryName || `Category #${categoryId}`}</h2>
                                <p>Add, edit, or delete items in this category</p>
                            </div>
                            <button
                                className="manageAddButton"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus size={18} strokeWidth={3} style={{ marginRight: '0.5rem', verticalAlign: 'middle', marginTop: '-2px' }} />
                                Add Item
                            </button>
                        </div>

                        <div className="manageItemList">
                            {Array.isArray(items) && items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item.id} className="manageItemCard">
                                        <div className="manageItemImage">
                                            <Image
                                                src={item.imageUrl || '/images/placeholder.jpg'}
                                                alt={item.name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="manageItemInfo">
                                            <h3>{item.name}</h3>
                                            <p>{item.description || 'No description'}</p>
                                            <span className="manageItemPrice">{item.price.toFixed(2)} грн</span>
                                            {item.calories != null && <span className="manageItemCalories"> / {item.calories} cal</span>}
                                        </div>
                                        <div className="manageItemActions">
                                            <button className="actionIcon" onClick={() => openEditModal(item)}>
                                                <Settings size={20} />
                                            </button>
                                            <button className="actionIcon" onClick={() => handleDeleteItem(item.id)}>
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="noDataText">No items added yet for this category.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}