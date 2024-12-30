"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function Page({ params }) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const resolvedParams = use(params); // Unwrap the params Promise
    const slug = resolvedParams.slug; // Access the slug after unwrapping
  
    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    return (
        <div>
            <p>{slug}</p>
        </div>
    );
}