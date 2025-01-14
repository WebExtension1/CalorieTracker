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
  const [filterType, setFilterType] = useState(1);
  const [filteredData, setFilteredData] = useState(foodData);
  const [yesterdayRemaining, setYesterdayRemaining] = useState();
  const [todaysLimit, setTodaysLimit] = useState();
  const [todaysAmount, setTodaysAmount] = useState();
  const [message, setMessage] = useState();
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const yesterdayRes = await fetch("/api/getYesterdaysTotal");
        const yesterdayData = await yesterdayRes.json();
        console.log("/getYesterdaysTotal:", yesterdayData);

        if (yesterdayData && yesterdayData.recordsets && yesterdayData.recordsets[0]) {
          console.log("/getYesterdaysTotal:", yesterdayData.recordsets[0]);
          const yesterdayCalories = yesterdayData.recordsets[0][0]?.total_calories || 0;
          const remainingCalories = parseInt(process.env.NEXT_PUBLIC_CALORIE_LIMIT) - yesterdayCalories;
          setYesterdayRemaining(remainingCalories);
  
          const limit = parseInt(process.env.NEXT_PUBLIC_CALORIE_LIMIT) + remainingCalories;
          setTodaysLimit(limit);
  
          const todayRes = await fetch("/api/getTodaysHistory");
          const todayData = await todayRes.json();
          console.log("/getTodaysHistory:", todayData);
  
          if (todayData && todayData.recordsets && todayData.recordsets[0]) {
            console.log("/getTodaysHistory:", todayData.recordsets[0]);
            setTodaysCalories(todayData.recordsets[0]);
          } else {
            console.error("Invalid response structure:", todayData);
          }
  
          let totalCalories = Array.isArray(todayData.recordsets[0]) ? todayData.recordsets[0].reduce(
            (acc, item) => acc + parseInt(item.calories) * parseInt(item.quantity),
            0
          ): 0;
          setTodaysAmount(totalCalories);
  
          let newMessage = "You have reached your limit for the day";
          if (totalCalories < limit) newMessage = `You have ${limit - totalCalories} calories left today`;
          else if (totalCalories > limit) newMessage = `You have gone ${totalCalories - limit} calories over your limit today`;
          setMessage(newMessage);
  
          const foodRes = await fetch("/api/getFood");
          const food = await foodRes.json();
          console.log("/getFood:", food);
  
          if (food && food.recordsets && food.recordsets[0]) {
            console.log("/getFood:", food.recordsets[0]);
            setFoodData(food.recordsets[0]);
          } else {
            console.error("Invalid response structure:", food);
          }
        } else {
          console.error("Invalid response structure:", yesterdayData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  async function addNew(temp) {
    if (temp) router.push(`/food/new/3`);
    else router.push(`/food/new/${filterType}`);
  };

  async function filterData(event) {
    const query = event?.target?.value?.toLowerCase() || "";
    const filtered = foodData.filter((food) =>
      food.name.toLowerCase().includes(query) && food.typeID === filterType
    );

    const grouped = {};
  
    filtered.forEach((item) => {
      if (item.typeID === filterType) {
        const firstLetter = item.name[0].toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(item);
      }
    });

    setFilteredData(grouped);
    setLetters(Object.keys(grouped).sort());
  };

  useEffect(() => {
    filterData();
  }, [foodData, filterType]);

  if (loading) return <div>Loading Resources...</div>

  async function deleteItem(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const quantity = formData.get('quantity');
    const position = formData.get('position');

    try {
      const response = await fetch('/api/removeFromHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data);
        alert('An error occurred. Please try again later.');
      } else {
        setTodaysCalories((prevTodaysCalories) => {
          const newTodaysCalories = [...prevTodaysCalories];
          newTodaysCalories.splice(position, 1);
          return newTodaysCalories;
        });

        const calories = foodData.find(item => item.name === name).calories;
        const newAmount = todaysAmount - (quantity * calories)
        setTodaysAmount(newAmount);

        let newMessage = "You have reached your limit for the day";
        if (newAmount < todaysLimit) newMessage = `You have ${todaysLimit - newAmount} calories left today`;
        else if (newAmount > todaysLimit) newMessage = `You have gone ${newAmount - todaysLimit} calories over your limit today`;
        setMessage(newMessage);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert('An error occurred. Please try again later.');
    }
    router.refresh();
  }

  if (user?.email != process.env.NEXT_PUBLIC_WHITELISTED_EMAIL) {
    return (
      <div className="flex flex-col min-h-screen p-4 gap-8 sm:p-8 sm:gap-16 font-sans">
        <div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => signOut(auth)}
          >
          Sign Out
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm sm:text-base">You don&apos;t have permissions to access these resouces</p>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="flex flex-col min-h-screen p-4 gap-8 sm:p-8 sm:gap-16 font-sans">
        <div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => signOut(auth)}
          >
          Sign Out
          </button>
        </div>
        <div id="stats" className="text-center">
          <p className="text-sm sm:text-base">You have {yesterdayRemaining} calories carried over from yesterday</p>
          <p className="text-sm sm:text-base">Today you have used {todaysAmount} of {todaysLimit} calories</p>
          <p className="text-sm sm:text-base font-semibold">{message}</p>
          <table id="history" className="table-auto w-full border-collapse mt-4 text-sm sm:text-base">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Calories</th>
                <th className="border-b px-4 py-2">Quantity</th>
                <th className="border-b px-4 py-2">Total</th>
                <th className="border-b px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(todaysCalories) && todaysCalories.length > 0 ? (
              todaysCalories.map((history, index) => (
                <tr key={`${history}-${index}`}>
                  <td className="border-b px-4 py-2">{history.name}</td>
                  <td className="border-b px-4 py-2">{history.calories}</td>
                  <td className="border-b px-4 py-2">{history.quantity}</td>
                  <td className="border-b px-4 py-2">{history.quantity * history.calories}</td>
                  <td className="border-b px-4 py-2">
                     <form onSubmit={deleteItem} method="POST" className="flex flex-col gap-6 w-full max-w-md">
                        <input type="hidden" value={index} name="position"/>
                        <input type="hidden" value={history.name} name="name" />
                        <input type="hidden" value={history.quantity} name="quantity" />
                        <button type="submit">Remove</button>
                      </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border-b px-4 py-2 text-center">No data available</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-7">
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

        <div className="text-center">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => addNew(false)}
          >
            Add New
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => addNew(true)}
          >
            Add Temp
          </button>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <p>Search</p>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
            onChange={(e) => filterData(e)}
            />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => document.getElementById(letter).scrollIntoView()}
              className="text-sm p-2 hover:bg-gray-200"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {letters.map((letter) => (
            <div key={letter}>
              <h2 id={letter} className="font-semibold text-xl mt-6">{letter}</h2>
              <table className="table-auto w-full mt-2 text-sm sm:text-base text-center">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 w-1/2">Name</th>
                    <th className="border-b px-4 py-2 w-1/8">Calories</th>
                    <th className="border-b px-4 py-2 2-1/8">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData[letter]?.map((food) => (
                    <tr key={food.name}>
                      <td className="border-b px-4 py-2">{food.name}</td>
                      <td className="border-b px-4 py-2">{food.calories}</td>
                      <td className="border-b px-4 py-2 flex items-center justify-center gap-10">
                        <a href={`/food/edit/${food.name}`} className="text-blue-500 hover:underline">Edit</a>
                        {filterType === 1 && (
                        <a
                          href={`/food/${food.name}`}
                          className="text-green-500 hover:underline"
                        >
                          +
                        </a>
                      )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
