'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react'; // Імпортуємо useSession

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { data: session, status, update } = useSession(); // Отримуємо сесію та її статус + функцію update

    // --- ОНОВЛЮЄМО ЛОГІН ЧЕРЕЗ EMAIL/ПАРОЛЬ ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false, // НЕ перенаправляємо автоматично
            email: email,
            password: password,
        });

        if (result.error) {
            setError(result.error);
        } else if (result.ok) {
            // Вхід успішний, тепер треба визначити, куди перенаправити
            // Оновлюємо сесію, щоб отримати дані користувача (включаючи роль)
            const updatedSession = await update();
            if (updatedSession?.user?.role === 'OWNER') {
                router.push('/manage/restaurants'); // Власника - в адмінку
            } else {
                router.push('/menu'); // Клієнта - в меню
            }
        }
    };

    // --- ОНОВЛЮЄМО ЛОГІН ЧЕРЕЗ GOOGLE ---
    const handleGoogleSignIn = () => {
        // Ми не можемо дізнатися роль ДО перенаправлення на Google.
        // Тому ми просимо Google повернути нас на спеціальну сторінку
        // /auth/check-role, яка зробить перевірку ролі і фінальне перенаправлення.
        signIn('google', { callbackUrl: '/auth/check-role' });
    };

    return (
        <main className="pageContainer loginPageContainer">
            <div className="loginContentWrapper">
                {/* Кнопка закриття веде на лендінг */}
                <Link href="/" className="loginCloseBtn">×</Link>

                <h1 className="loginTitle">Вхід</h1>

                <form onSubmit={handleLogin}>
                    {/* ... (поля вводу email та пароля) ... */}
                    <div className="inputGroup">
                        <input
                            type="email"
                            className="loginInput"
                            placeholder="Введіть e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <input
                            type="password"
                            className="loginInput"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <button type="submit" className="loginSubmitBtn">
                        Вхід
                    </button>
                </form>

                <button
                    className="googleBtn"
                    onClick={handleGoogleSignIn}
                >
                    <span className="googleIcon">G</span> Продовжити через Google
                </button>

                <div className="loginLinks">
                    <Link href="/login?role=owner" className="loginLink">
                        Увійти як власник
                    </Link>
                    <Link href="/signup" className="loginLink">
                        Ще не зареєстрований?
                    </Link>
                </div>
            </div>
        </main>
    );
}