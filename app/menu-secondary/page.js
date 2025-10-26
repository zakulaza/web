// app/menu-secondary/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import CartModal from '../components/CartModal';
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react'; // Потрібен для зображення профілю
import { ArrowLeft, ShoppingCart, User } from 'lucide-react'; // Імпортуємо іконки

export default function MenuSecondaryPage() {
    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    const { addToCart, cartCount } = useCart();
    const { data: session } = useSession(); // Отримуємо сесію для іконки профілю

    useEffect(() => {
        if (category) {
            fetch(`/api/dishes?category=${category}`)
                .then((res) => res.json())
                .then((data) => {
                    setDishes(data);
                });
        }
    }, [category]);

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

            <main className="pageContainer menuPageContainer">
                <div className="secondaryMenuContentWrapper">
                    <header className="secondaryMenuHeaderNew">
                        <Link href="/menu" className="backButton">
                            <ArrowLeft size={24} strokeWidth={2.5} /> {/* Заміна ← */}
                        </Link>
                        <div className="restaurantInfo">
                            <h3>NAZVA</h3>
                            <p>description of the restaurant</p>
                        </div>
                        <div className="headerIcons">
              <span className="cartIcon" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={22} strokeWidth={2.5} /> {/* Заміна 🛒 */}
                  {cartCount > 0 && <span className="cartCountBadge">{cartCount}</span>}
              </span>
                            <span className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                 {session?.user?.image ? (
                     <img src={session.user.image} alt="profile" className="headerProfileImage" />
                 ) : (
                     <User size={22} strokeWidth={2.5} /> // Заміна 👤
                 )}
              </span>
                        </div>
                    </header>

                    <div className="secondaryMenuBody">
                        <nav className="secondarySideNav">
                            {/* --- КУХНЯ --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Кухня</span>
                                <ul className="dropdown-menu">
                                    <li><Link href="/menu-secondary?category=Гарячі страви" className="sideNavItem-sub">Гарячі страви</Link></li>
                                    <li><Link href="/menu-secondary?category=Супи" className="sideNavItem-sub">Супи</Link></li>
                                    <li><Link href="/menu-secondary?category=Салати" className="sideNavItem-sub">Салати</Link></li>
                                    <li><Link href="/menu-secondary?category=Десерти" className="sideNavItem-sub">Десерти</Link></li>
                                </ul>
                            </div>
                            {/* --- НАПОЇ --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Напої</span>
                                <ul className="dropdown-menu">
                                    <li><Link href="/menu-secondary?category=Алкогольні напої" className="sideNavItem-sub">Алкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Безалкогольні напої" className="sideNavItem-sub">Безалкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Кава" className="sideNavItem-sub">Кава</Link></li>
                                    <li><Link href="/menu-secondary?category=Чай" className="sideNavItem-sub">Чай</Link></li>
                                </ul>
                            </div>
                            {/* --- ПІЦА --- */}
                            <Link href="/menu-secondary?category=Піца" className="sideNavItem">
                                Піца
                            </Link>
                        </nav>

                        <div className="dishListNew">
                            <div className="dishListHeader">
                                <h3>{category || 'Страви'}</h3>
                                <div className="dishProgress">
                                    {/* TODO: Отримувати level/progress */}
                                    <span>lvl. 23</span>
                                    <div className="dishProgressBar"><div className="dishProgressBarFill" style={{ width: '83%' }}></div></div>
                                    <span>83%</span>
                                </div>
                            </div>

                            {Array.isArray(dishes) && dishes.map((dish) => (
                                <div key={dish.id} className="dishItemNew">
                                    <div className="dishInfoNew">
                                        <h4>{dish.name}</h4>
                                        <p>{dish.description || 'Опис відсутній'}</p>
                                        <div className="dishDetailsNew">
                                            <span className="dishPriceNew">{dish.price} грн</span>
                                        </div>
                                        <div className="dishCaloriesNew">
                                            <span className="caloriesBar red"></span>
                                            <span className="caloriesBar green"></span>
                                        </div>
                                    </div>
                                    <div className="dishImageContainerNew">
                                        <Image
                                            src={dish.imageUrl || '/images/placeholder.jpg'}
                                            alt={dish.name}
                                            width={90}
                                            height={90}
                                            className="dishImageNew"
                                        />
                                        <button
                                            className="dishAddButtonNew"
                                            onClick={() => addToCart(dish)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}