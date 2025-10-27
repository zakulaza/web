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
        // pageContainer + loginPageContainer
        <main className="w-full min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">

            {/* loginContentWrapper */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-md w-full relative">

                {/* loginCloseBtn */}
                <Link href="/" className="absolute top-4 right-4 text-2xl text-gray-400 no-underline font-bold hover:text-gray-600">×</Link>

                {/* loginTitle */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 text-left">Реєстрація</h1>

                <form onSubmit={handleSubmit}>

                    {/* inputGroup (з label) */}
                    <div className="mb-5 text-left">
                        <label htmlFor="email" className="block font-medium mb-2 text-sm text-gray-700">
                            E-mail
                        </label>
                        {/* loginInput */}
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Введіть e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* inputGroup (з label) */}
                    <div className="mb-5 text-left">
                        <label htmlFor="password" className="block font-medium mb-2 text-sm text-gray-700">
                            Пароль
                        </label>
                        {/* loginInput */}
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* loginError */}
                    {error && <p className="text-red-700 bg-red-100 border border-red-200 rounded-lg p-3 text-center text-sm mt-4">{error}</p>}

                    {/* loginSubmitBtn */}
                    <button type="submit" className="w-full p-3 sm:p-4 border-none rounded-lg bg-green-500 text-white text-base sm:text-lg font-bold cursor-pointer mt-4 transition hover:bg-green-600">
                        Зареєструватись
                    </button>
                </form>

                {/* loginLinks */}
                <div className="flex justify-between mt-6 flex-wrap gap-2">
                    {/* loginLink */}
                    <Link href="/login" className="text-gray-600 underline text-sm cursor-pointer transition hover:text-black">
                        Вже зареєстрований?
                    </Link>
                </div>

            </div>
        </main>
    );
}