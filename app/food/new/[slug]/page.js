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
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Link href="/">Back to Dashboard</Link>
            <form onSubmit={onSubmit} method="POST">
                <p>Name</p>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <p>Calories</p>
                <input
                    type="number"
                    name="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    min="0"
                    required
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
}