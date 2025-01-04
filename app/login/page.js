// https://www.youtube.com/watch?v=lQftwBTCejE

"use client";

import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const res = await signInWithEmailAndPassword(email, password);
            setEmail('');
            setPassword('');

            if (res.user) {
                router.push('/');
            }
        } catch (e) {
            console.error(e);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-8 gap-8 sm:p-20 items-center justify-center font-sans">
            <p className="text-xl sm:text-2xl font-semibold text-center">Login</p>
            <form onSubmit={handleSignIn} className="flex flex-col gap-6 w-full max-w-md">
                <label htmlFor="email" className="text-sm sm:text-base font-semibold">
                    Email
                </label>
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    required
                />
                <label htmlFor="password" className="text-sm sm:text-base font-semibold">
                    Password
                </label>
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
                    required
                />
                {error && <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>}
            <button 
                type="submit" 
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Sign In
            </button>
            </form>
        </div>
    );
}
