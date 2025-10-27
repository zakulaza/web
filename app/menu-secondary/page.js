'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import CartModal from '../components/CartModal';
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShoppingCart, User } from 'lucide-react';

export default function MenuSecondaryPage() {
    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    const { addToCart, cartCount } = useCart();
    const { data: session } = useSession();

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

            {/* pageContainer + menuPageContainer */}
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                {/* secondaryMenuContentWrapper */}
                <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col overflow-hidden">
                    
                    {/* secondaryMenuHeaderNew */}
                    <header className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0 w-full max-w-7xl mx-auto">
                        {/* backButton */}
                        <Link href="/menu" className="text-2xl sm:text-3xl no-underline text-gray-800 font-bold">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        {/* restaurantInfo */}
                        <div className="text-left flex-grow overflow-hidden">
                            <h3 className="m-0 text-base sm:text-lg font-semibold truncate">NAZVA</h3>
                            <p className="m-0 text-sm text-gray-500 truncate">description of the restaurant</p>
                        </div>
                        {/* headerIcons */}
                        <div className="flex gap-4 sm:gap-6">
                            {/* cartIcon */}
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative" onClick={() => setIsCartOpen(true)}>
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {/* cartCountBadge */}
                                {cartCount > 0 && <span className="absolute -top-2 -right-2.5 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold leading-none min-w-[18px] text-center">{cartCount}</span>}
                            </span>
                            {/* profileIcon */}
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative" onClick={() => setIsProfileOpen(true)}>
                                {session?.user?.image ? (
                                    // headerProfileImage
                                    <img src={session.user.image} alt="profile" className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <User size={22} strokeWidth={2.5} />
                                )}
                            </span>
                        </div>
                    </header>

                    {/* secondaryMenuBody */}
                    <div className="flex flex-grow overflow-hidden w-full max-w-7xl mx-auto">
                        
                        {/* secondarySideNav */}
                        <nav className="flex flex-col p-4 sm:p-5 border-r border-gray-100 gap-2 flex-shrink-0 w-[150px] sm:w-[220px] overflow-y-auto">
                            
                            {/* --- КУХНЯ (з Tailwind 'group' для hover) --- */}
                            {/* sideNavItem + with-dropdown */}
                            <div className="relative group no-underline text-gray-800 px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-100">
                                <span>Кухня</span>
                                {/* dropdown-menu (з 'group-hover:block') */}
                                <ul className="hidden group-hover:block list-none p-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg absolute z-20 w-full left-0 top-full">
                                    {/* sideNavItem-sub */}
                                    <li><Link href="/menu-secondary?category=Гарячі страви" className="block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Гарячі страви</Link></li>
                                    <li><Link href="/menu-secondary?category=Супи" className="sideNavItem-sub block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Супи</Link></li>
                                    <li><Link href="/menu-secondary?category=Салати" className="sideNavItem-sub block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Салати</Link></li>
                                    <li><Link href="/menu-secondary?category=Десерти" className="sideNavItem-sub block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Десерти</Link></li>
                                </ul>
                            </div>
                            
                            {/* --- НАПОЇ (з Tailwind 'group' для hover) --- */}
                            <div className="relative group no-underline text-gray-800 px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-100">
                                <span>Напої</span>
                                <ul className="hidden group-hover:block list-none p-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg absolute z-20 w-full left-0 top-full">
                                    <li><Link href="/menu-secondary?category=Алкогольні напої" className="block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Алкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Безалкогольні напої" className="block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Безалкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Кава" className="block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Кава</Link></li>
                                    <li><Link href="/menu-secondary?category=Чай" className="block no-underline text-gray-800 px-3 py-2 rounded-md text-left font-medium text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-200">Чай</Link></li>
                                </ul>
                            </div>
                            
                            {/* --- ПІЦА (звичайний Link) --- */}
                            {/* sideNavItem */}
                            <Link href="/menu-secondary?category=Піца" className="no-underline text-gray-800 px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis hover:bg-gray-100">
                                Піца
                            </Link>
                        </nav>

                        {/* dishListNew */}
                        <div className="flex-grow p-4 sm:p-5 lg:px-10 overflow-y-auto text-left">
                            {/* dishListHeader */}
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                                <h3 className="m-0 text-lg sm:text-xl font-semibold">{category || 'Страви'}</h3>
                                {/* dishProgress */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm text-gray-500 font-medium">lvl. 23</span>
                                    {/* dishProgressBar */}
                                    <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        {/* dishProgressBarFill */}
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">83%</span>
                                </div>
                            </div>

                            {Array.isArray(dishes) && dishes.map((dish) => (
                                // dishItemNew
                                <div key={dish.id} className="flex gap-3 sm:gap-4 border-b border-gray-100 py-4 sm:py-6 last:border-b-0">
                                    {/* dishInfoNew */}
                                    <div className="flex-grow overflow-hidden">
                                        <h4 className="m-0 mb-1 text-base sm:text-lg font-semibold truncate">{dish.name}</h4>
                                        <p className="m-0 mb-2 text-sm text-gray-500 line-clamp-2">{dish.description || 'Опис відсутній'}</p>
                                        {/* dishDetailsNew */}
                                        <div className="flex items-baseline gap-2">
                                            {/* dishPriceNew */}
                                            <span className="text-sm sm:text-base font-bold text-gray-800">{dish.price} грн</span>
                                        </div>
                                        {/* dishCaloriesNew */}
                                        <div className="flex gap-1 mt-2">
                                            {/* caloriesBar red */}
                                            <span className="h-1.5 rounded-full w-[30px] bg-red-500"></span>
                                            {/* caloriesBar green */}
                                            <span className="h-1.5 rounded-full w-[20px] bg-green-500"></span>
                                        </div>
                                    </div>
                                    {/* dishImageContainerNew */}
                                    <div className="relative flex-shrink-0">
                                        {/* dishImageNew */}
                                        <Image
                                            src={dish.imageUrl || '/images/placeholder.jpg'}
                                            alt={dish.name}
                                            width={90}
                                            height={90}
                                            className="rounded-lg object-cover w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]"
                                        />
                                        {/* dishAddButtonNew */}
                                        <button
                                            className="absolute -bottom-2 -right-2 bg-white border border-gray-200 shadow-lg text-green-500 rounded-full w-8 h-8 sm:w-9 sm:h-9 text-3xl font-light cursor-pointer flex items-center justify-center leading-none transition-transform active:scale-90"
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