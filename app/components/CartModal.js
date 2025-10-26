// app/components/CartModal.js
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // НОВИЙ АБСОЛЮТНИЙ ШЛЯХ
import Image from 'next/image';
import { X, Trash2, Minus, Plus } from 'lucide-react'; // Імпортуємо іконки

export default function CartModal({ isOpen, onClose }) {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleCheckout = async () => {
        setIsLoading(true);
        setError('');
        console.log('Proceeding to checkout with items:', cartItems);

        try {
            const res = await fetch('/api/payment/mono', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems, totalAmount: cartTotal }),
            });

            const data = await res.json();

            if (!res.ok || !data.pageUrl) {
                throw new Error(data.error || 'Failed to initiate payment');
            }
            window.location.href = data.pageUrl;

        } catch (err) {
            console.error('Checkout error:', err);
            setError('Не вдалося розпочати оплату. Спробуйте ще раз.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileModal cartModal" onClick={(e) => e.stopPropagation()}>
                <button className="profileCloseButton" onClick={onClose}>
                    <X size={24} /> {/* Заміна × */}
                </button>
                <h2 className="modalTitle">Ваш Кошик</h2>

                {/* Обгортка для контенту з прокруткою */}
                <div className="cartModalContent">
                    {cartItems.length === 0 ? (
                        <p className="emptyCartText">Ваш кошик порожній.</p>
                    ) : (
                        <div className="cartItemsList">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cartItem">
                                    <div className="cartItemImage">
                                        <Image
                                            src={item.imageUrl || '/images/placeholder.jpg'}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="cartItemDetails">
                                        <span className="cartItemName">{item.name}</span>
                                        <span className="cartItemPrice">{item.price} грн</span>
                                    </div>
                                    <div className="cartItemQuantity">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16}/></button> {/* Заміна - */}
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button> {/* Заміна + */}
                                    </div>
                                    <button className="cartItemRemove" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 size={18} /> {/* Заміна 🗑️ */}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div> {/* Кінець cartModalContent */}

                {error && <p className="loginError" style={{marginTop: '1rem', margin: '0 1.5rem 1rem'}}>{error}</p>}

                {cartItems.length > 0 && (
                    <div className="cartFooter">
                        <div className="cartTotal">
                            <span>Разом:</span>
                            <span>{cartTotal.toFixed(2)} грн</span>
                        </div>
                        <button
                            className="modalButton primary checkoutButton"
                            onClick={handleCheckout}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Створення платежу...' : 'Оформити замовлення (Mono)'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}