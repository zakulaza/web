// app/signup/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to sign up');
            }

            // Якщо реєстрація успішна, перекидаємо на сторінку входу
            router.push('/login');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        // 1. Використовуємо класи для центрування (як на сторінці /login)
        <main className="pageContainer loginPageContainer">

            {/* 2. Використовуємо обгортку для обмеження ширини, тіні та білого фону */}
            <div className="loginContentWrapper">

                {/* Кнопка закриття (додамо, як на /login) */}
                <Link href="/" className="loginCloseBtn">×</Link>

                <h1 className="loginTitle">Реєстрація</h1>

                <form onSubmit={handleSubmit}>

                    <div className="inputGroup">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            className="loginInput"
                            placeholder="Введіть e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            className="loginInput"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="loginError">{error}</p>}

                    <button type="submit" className="loginSubmitBtn">
                        Зареєструватись
                    </button>
                </form>

                <div className="loginLinks">
                    <Link href="/login" className="loginLink">Вже зареєстрований?</Link>
                </div>

            </div>
        </main>
    );
}