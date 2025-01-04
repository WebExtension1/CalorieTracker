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

            if (response.ok) {
                // alert('Calories updated successfully');
            }
        } catch (err) {
            console.error('Error details:', err);
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

            if (response.ok) {
                // alert('Item successfully removed');
                router.push("/");
            }
        } catch (err) {
            console.error('Error details:', err);
            alert('An error occurred. Please try again later.');
        }
    }

    if (loading) return <div>Loading Resources...</div>

    return(
        <div className="flex flex-col min-h-screen p-4 gap-8 sm:p-8 sm:gap-16 font-sans">
            <Link 
                href="/" 
                className="text-blue-500 hover:underline"
            >
                Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-center sm:text-2xl">{slug.replace("%20", " ")}</h1>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <label htmlFor="calories" className="text-sm sm:text-base font-semibold">
                    Calories
                </label>
                <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value))}
                    name="calories"
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    placeholder="Enter calories"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Update
                </button>
            </form>
            <div className="text-center">
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Item</button>
            </div>
        </div>
    );
}