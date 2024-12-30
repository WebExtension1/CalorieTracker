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
        <div>
            <p>Login</p>
            <form onSubmit={handleSignIn}>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
