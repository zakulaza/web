'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Додано useRouter
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import CartModal from '../components/CartModal';
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react'; // Додано Chevrons

// --- КОМПОНЕНТ ДЛЯ ВИПАДАЮЧОГО МЕНЮ (з useState) ---
// (Логіка випадаючого меню залишається без змін)
function DropdownNavItem({ title, links, currentCategory, restaurantId }) {
    const [isOpen, setIsOpen] = useState(false);
    const isActive = links.some(link => link.category === currentCategory);

    return (
        <div className="relative">
            <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap truncate flex justify-between items-center ${isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-800'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <ul className="list-none p-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg absolute z-20 w-full left-0 top-full">
                    {links.map((link) => (
                        <li key={link.category}>
                            <Link
                                href={`/menu-secondary?id=${restaurantId}&category=${link.category}`}
                                className={`block no-underline px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap truncate ${link.category === currentCategory ? 'bg-gray-300 font-semibold' : 'text-gray-800 hover:bg-gray-200'}`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function MenuSecondaryPage() {
    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Додано стан завантаження

    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get('category');
    const restaurantId = searchParams.get('id') || '1';

    const { addToCart, cartCount } = useCart();
    const { data: session, status } = useSession();

    const userName = session?.user?.name || 'Клієнт';
    const profileInitial = userName.charAt(0);
    const userImage = session?.user?.image;

    const kitchenLinks = [
        { name: 'Гарячі страви', category: 'Гарячі страви' },
        { name: 'Супи', category: 'Супи' },
        { name: 'Салати', category: 'Салати' },
        { name: 'Десерти', category: 'Десерти' },
    ];
    const drinksLinks = [
        { name: 'Алкогольні напої', category: 'Алкогольні напої' },
        { name: 'Безалкогольні напої', category: 'Безалкогольні напої' },
        { name: 'Кава', category: 'Кава' },
        { name: 'Чай', category: 'Чай' },
    ];

    // --- ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ З БД ---
    useEffect(() => {
        if (category && restaurantId) {
            setIsLoading(true); // Починаємо завантаження

            // Формуємо URL для API, який, ймовірно, знаходиться в /app/api/dishes/route.js
            const apiUrl = `/api/dishes?restaurantId=${restaurantId}&category=${category}`;

            fetch(apiUrl)
                .then((res) => {
                    if (!res.ok) {
                        console.error('Failed to fetch dishes, status:', res.status);
                        return []; // Повертаємо порожній масив у разі помилки
                    }
                    return res.json();
                })
                .then((data) => {
                    setDishes(data); // Встановлюємо дані з БД
                })
                .catch((error) => {
                    console.error("Error fetching dishes:", error);
                    setDishes([]); // Скидаємо страви у разі помилки
                })
                .finally(() => {
                    setIsLoading(false); // Завершуємо завантаження
                });

        } else {
            // Якщо категорія не обрана, просто не показуємо завантаження
            setIsLoading(false);
            setDishes([]);
        }
    }, [category, restaurantId]); // Залежність від обох параметрів

    // --- ОБРОБКА СТАНІВ ЗАВАНТАЖЕННЯ ТА АВТЕНТИФІКАЦІЇ ---
    if (status === "loading") {
        return <main className="w-full min-h-screen flex flex-col bg-white justify-center items-center"><div className="p-8 text-center text-gray-500">Завантаження сесії...</div></main>;
    }
    if (status === "unauthenticated") {
        router.push('/login');
        return null;
    }

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col overflow-hidden">

                    {/* --- ХЕДЕР --- */}
                    <header className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0 w-full">
                        <Link href="/menu" className="text-2xl sm:text-3xl no-underline text-gray-800 font-bold">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <div className="text-left flex-grow overflow-hidden">
                            <h3 className="m-0 text-base sm:text-lg font-semibold truncate">NAZVA</h3>
                            <p className="m-0 text-sm text-gray-500 truncate">description of the restaurant</p>
                        </div>
                        <div className="flex gap-4 sm:gap-6">
                            <button className="text-xl sm:text-2xl cursor-pointer z-10 relative text-gray-800" onClick={() => setIsCartOpen(true)}>
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2.5 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold leading-none min-w-[18px] text-center">{cartCount}</span>}
                            </button>
                            <button className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95 overflow-hidden" onClick={() => setIsProfileOpen(true)}>
                                {userImage ? (
                                    <Image src={userImage} alt="profile" width={40} height={40} className="rounded-full object-cover w-full h-full" />
                                ) : (
                                    <span className="font-semibold">{profileInitial}</span>
                                )}
                            </button>
                        </div>
                    </header>

                    {/* --- ТІЛО МЕНЮ --- */}
                    <div className="flex flex-grow overflow-hidden w-full">

                        {/* --- БІЧНА НАВІГАЦІЯ --- */}
                        <nav className="flex flex-col p-4 sm:p-5 border-r border-gray-100 gap-2 flex-shrink-0 w-[150px] sm:w-[220px] overflow-y-auto">

                            <DropdownNavItem
                                title="Кухня"
                                links={kitchenLinks}
                                currentCategory={category}
                                restaurantId={restaurantId}
                            />

                            <DropdownNavItem
                                title="Напої"
                                links={drinksLinks}
                                currentCategory={category}
                                restaurantId={restaurantId}
                            />

                            <Link
                                href={`/menu-secondary?id=${restaurantId}&category=Піца`}
                                className={`no-underline px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap truncate ${category === 'Піца' ? 'bg-gray-200 text-gray-900' : 'text-gray-800 hover:bg-gray-100'}`}
                            >
                                Піца
                            </Link>
                        </nav>

                        {/* --- СПИСОК СТРАВ --- */}
                        <div className="flex-grow p-4 sm:p-5 lg:px-8 overflow-y-auto text-left">
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                                <h3 className="m-0 text-lg sm:text-xl font-semibold">{category || 'Страви'}</h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm text-gray-500 font-medium">lvl. 23</span>
                                    <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">83%</span>
                                </div>
                            </div>

                            {/* Умовний рендеринг залежно від стану завантаження та наявності страв */}
                            {isLoading ? (
                                <p className="text-gray-500">Завантаження страв...</p>
                            ) : Array.isArray(dishes) && dishes.length > 0 ? (
                                dishes.map((dish) => (
                                    <div key={dish.id} className="flex gap-3 sm:gap-4 border-b border-gray-100 py-4 sm:py-6 last:border-b-0">
                                        <div className="flex-grow overflow-hidden">
                                            <h4 className="m-0 mb-1 text-base sm:text-lg font-semibold truncate">{dish.name}</h4>
                                            <p className="m-0 mb-2 text-sm text-gray-500 line-clamp-2">{dish.description || 'Опис відсутній'}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm sm:text-base font-bold text-gray-800">{dish.price} грн</span>
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                <span className="h-1.5 rounded-full w-[30px] bg-red-500"></span>
                                                <span className="h-1.5 rounded-full w-[20px] bg-green-500"></span>
                                            </div>
                                        </div>
                                        <div className="relative flex-shrink-0">
                                            <Image
                                                src={dish.imageUrl || 'https://placehold.co/90x90/f0f2f5/333?text=Dish'}
                                                alt={dish.name}
                                                width={90}
                                                height={90}
                                                className="rounded-lg object-cover w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]"
                                            />
                                            <button
                                                className="absolute -bottom-2 -right-2 bg-white border border-gray-200 shadow-lg text-green-500 rounded-full w-8 h-8 sm:w-9 sm:h-9 text-3xl font-light cursor-pointer flex items-center justify-center leading-none transition-transform active:scale-90"
                                                onClick={() => addToCart(dish)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Страви в цій категорії відсутні.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

