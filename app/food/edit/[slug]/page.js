"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page({ params }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const [calories, setCalories] = useState(0);

    useEffect(() => {
    if (loading) return;
    if (!user) {
        router.push('/login');
    }
    }, [user, router]);

    if (loading) return <div>Loading Resources...</div>

    async function handleUpdate() {
        try {
            const response = await fetch('/api/setFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calories, name: slug }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert('Calories updated successfully');
            }
        } catch (err) {
            alert('An error occurred. Please try again later.');
        }
    }

    async function handleDelete() {
        try {
            const response = await fetch('/api/deleteFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: slug }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert('Item successfully removed');
                router.push("/");
            }
        } catch (err) {
            alert('An error occurred. Please try again later.');
        }
    }

    return(
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Link href="/">Back to Dashboard</Link>
            <h1>{slug.replace("%20", " ")}</h1>
            <form onSubmit={handleUpdate}>
                <p>Calories</p>
                <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value))}
                    name="calories"
                />
                <button>Update</button>
            </form>
            <button onClick={handleDelete}>Delete Item</button>
        </div>
    );
}