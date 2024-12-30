"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  console.log("Logged in as " + user?.email);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </div>
      <p>Site</p>
    </div>
  );
}
