"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await fetch("/api/food");
        const data = await res.json();
        setFoodData(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodData();
  }, []);
  

  if (user?.email != process.env.NEXT_PUBLIC_WHITELISTED_EMAIL) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div>
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <p>You don't have permissions to access these resouces</p>
      </div>
    );
  }
  else {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div>
          <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <div id="stats">
          <p>Here would display the stats</p>
        </div>
        <div class="flex gap-x-7">
          <p id="food" class="underline">Food</p>
          <p id="condiments">Condiments</p>
        </div>
        <div id="items">
          {foodData.map((food) => (
            <div class="item">
              <p>{food.name}</p>
              <a href={`/food/${food.name}`}>Add</a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}