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
  const [todaysCalories, setTodaysCalories] = useState([]);
  const [yesterdaysCalories, setYesterdaysCalories] = useState([]);
  const [filterType, setFilterType] = useState(1);
  const filteredData = foodData.filter((food) => food.typeID === filterType);
  const yesterdayRemaining = process.env.NEXT_PUBLIC_CALORIE_LIMIT - yesterdaysCalories[0]?.total_calories || 0;
  const todaysLimit = parseInt(process.env.NEXT_PUBLIC_CALORIE_LIMIT) + parseInt(yesterdayRemaining); 

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

  useEffect(() => {
    const fetchTodaysHistory = async () => {
      try {
        const res = await fetch("/api/getTodaysHistory");
        const data = await res.json();
        setTodaysCalories(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchTodaysHistory();
  }, []);

  useEffect(() => {
    const fetchYesterdaysTotal = async () => {
      try {
        const res = await fetch("/api/getYesterdaysTotal");
        const data = await res.json();
        setYesterdaysCalories(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchYesterdaysTotal();
  }, []);

  async function addNew() {
    router.push(`/food/new/${filterType}`);
  };

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
          <p>You have {yesterdayRemaining} calories left from yesterday</p>
          <div id="history">
            <p>Todays Limit is: {todaysLimit}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Calories</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {todaysCalories.map((history) => (
                  <tr>
                    <td>{history.name}</td>
                    <td>{history.calories}</td>
                    <td>{history.quantity}</td>
                    <td>{history.quantity * history.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex gap-x-7">
          <p
            id="food"
            className={`${filterType === 1 ? "font-bold underline" : ""}`}
            onClick={() => setFilterType(1)}
          >
            Food
          </p>
          <p
            id="condiments"
            className={`${filterType === 2 ? "font-bold underline" : ""}`}
            onClick={() => setFilterType(2)}
          >
            Condiments
          </p>
        </div>
        <button onClick={() => addNew()}>Add New</button>
        <div id="items">
          {filteredData.map((food) => (
            <div key={food.name} className="item flex gap-x-20">
              <p onClick={() => clicked()}>{food.name}</p>
              <a href={`/food/edit/${food.name}`}>Edit</a>
              {filterType === 1 ? <a href={`/food/${food.name}`}>+</a> : ""}
            </div>
          ))}
        </div>
      </div>
    );
  }
}