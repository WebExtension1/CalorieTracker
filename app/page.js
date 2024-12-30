"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await fetch("/api/getFood");
        const data = await res.json();
        setFoodData(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchFoodData();
  }, []);

  if (loading) return <div>Loading Resources...</div>

  function clicked() {
    console.log("Clicked");
  };

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
        <div className="flex gap-x-7">
          <p id="food" className="underline">Food</p>
          <p id="condiments">Condiments</p>
        </div>
        <div id="items">
          {foodData.map((food) => (
            <div className="item flex gap-x-20">
              <p onClick={() => clicked()}>{food.name}</p>
              <a href={`/food/edit/${food.name}`}>Edit</a>
              <a href={`/food/${food.name}`}>+</a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}