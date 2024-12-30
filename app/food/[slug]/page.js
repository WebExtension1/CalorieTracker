"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link'

export default function Page({ params }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const resolvedParams = use(params); // Unwrap the params Promise
  const slug = resolvedParams.slug; // Access the slug after unwrapping

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (loading) return <div>Loading Resources...</div>

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/">Back to Dashboard</Link>
      <p>{slug}</p>
    </div>
  );
}