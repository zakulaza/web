// app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
    // Автоматично перенаправляє користувача з '/' на '/login'
    redirect('/login');
}