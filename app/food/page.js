"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [user] = useAuthState(auth);
    const router = useRouter();
  
    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    return (
        <div>
            Page
        </div>
    );
}