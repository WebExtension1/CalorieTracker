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
    const [newName, setNewName] = useState();

    useEffect(() => {
    if (loading) return;
    if (!user) {
        router.push('/login');
    }
    }, [user, router]);

    useEffect(() => {
        const fetchFoodData = async () => {
          try {
            const res = await fetch("/api/getFood");
            const data = await res.json();
            console.log("/getFood:", data);
            
            if (data && data.recordsets && data.recordsets[0]) {
                console.log("/getFood:", data.recordsets[0]);
                const food = data.recordsets[0].find(item => item.name === slug.split('%20').join(' '));
                setCalories(food ? food.calories : 0);
            } else {
              console.error("Invalid response structure:", data);
            }
    
          } catch (error) {
            console.error("Error fetching food data:", error);
          }
        };
        fetchFoodData();
      }, []);

    if (loading) return <div>Loading Resources...</div>

    async function handleUpdate() {
        try {
            const response = await fetch('/api/setFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calories, name: slug, newName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update food');
            }

            router.push("/");
        } catch (err) {
            console.error('Error details:', err);
            router.push("/");
        }
    }

    async function handleDelete() {
        try {
            const response = await fetch('/api/deleteFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: slug }),
            });

            if (!response.ok) {
                throw new Error('Failed to update food');
            }

            router.push("/");
        } catch (err) {
            console.error('Error details:', err);
            router.push("/");
        }
    }

    if (loading) return <div>Loading Resources...</div>

    return (
        <div className="flex flex-col min-h-screen p-4 gap-8 sm:p-8 sm:gap-16 font-sans">
            <Link 
                href="/" 
                className="text-blue-500 hover:underline"
            >
                Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-center sm:text-2xl">{slug.split('%20').join(' ')}</h1>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-full max-w-md mx-auto">
                <label htmlFor="calories" className="text-sm sm:text-base font-semibold">
                    New name
                </label>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    name="newName"
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    placeholder="Enter new name (if applicable)"
                />
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
