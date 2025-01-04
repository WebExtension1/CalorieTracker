"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

export default function Page({ params }) {
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const router = useRouter();
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/addFood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, calories, type: slug }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/");
            } else {
                console.error("Error response:", data);
                alert('An error occurred. Please try again later.');
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 items-center justify-center font-sans">
            <Link href="/" className="text-blue-500 hover:underline">Back to Dashboard</Link>
            <form onSubmit={onSubmit} method="POST" className="flex flex-col gap-6 w-full max-w-md">
                <label htmlFor="name" className="text-sm sm:text-base font-semibold">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    required
                />
                <label htmlFor="calories" className="text-sm sm:text-base font-semibold">
                    Calories
                </label>
                <input
                    type="number"
                    name="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    required
                />
                <button 
                    type="submit"
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add
                </button>
            </form>
        </div>
    );
}