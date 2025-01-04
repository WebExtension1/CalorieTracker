"use client";

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page({ params }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [quantity, setQuantity] = useState();
  const [foodData, setFoodData] = useState();

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const res = await fetch("/api/getFood?typeID=2");
        const data = await res.json();
        setFoodData(data);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchFoodData();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (loading) return <div>Loading Resources...</div>

  async function addCondiment() {
    const condiments = document.querySelector("#condiments");
    
    const newCondiment = document.createElement("div");
    newCondiment.classList.add("flex", "flex-col", "gap-4", "mb-4", "w-full");
    condiments.appendChild(newCondiment);

    // Type
    const typeLabel = document.createTextNode("Type");
    newCondiment.appendChild(typeLabel);

    const typeInput = document.createElement("select");
    typeInput.setAttribute("name", "type[]")
    typeInput.setAttribute("class", "w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300");
    typeInput.required = true;
    newCondiment.appendChild(typeInput);

    foodData.forEach(function(food) {
      const option = document.createElement("option");
      option.value = food.name;
      option.textContent = food.name;
      typeInput.appendChild(option);
    })

    // Quantity
    const quantityLabel = document.createTextNode("Quantity");
    newCondiment.appendChild(quantityLabel);
    
    const quantityInput = document.createElement("input");
    quantityInput.setAttribute("min", "0");
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("name", "quantity[]")
    quantityInput.setAttribute("class", "w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300");
    quantityInput.required = true;
    newCondiment.appendChild(quantityInput);

    // Remove
    const remove = document.createElement("a");
    remove.textContent = "Remove";
    remove.addEventListener("click", function (event) {
      event.preventDefault();
      removeCondiment(newCondiment);
    });
    remove.setAttribute("class", "self-end px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600");
    newCondiment.appendChild(remove);
  }

  async function removeCondiment(condimentDiv) {
    condimentDiv.remove();
  }

  async function addToHistory(e) {
    e.preventDefault();
    try {
      const response = await fetch('/api/addHistory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: slug.replace("%20", " "), quantity }),
      });

      const data = await response.json();

      if (response.ok) {
          router.push("/");
      } else {
          console.error("Error response:", data);
          alert('An error occurred. Please try again later.');
      }
    } catch (err) {
        console.error("Fetch error:", err);
        alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 gap-8 sm:p-8 sm:gap-16 font-sans">
      <Link 
          href="/" 
          className="text-blue-500 hover:underline"
      >
          Back to Dashboard
      </Link>
      <h1 className="text-xl font-bold text-center sm:text-2xl">{slug.replace("%20", " ")}</h1>
      <form method="POST" className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <label htmlFor="quantity" className="text-sm sm:text-base font-semibold">
            Quantity
        </label>
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          className="w-full px-4 py-2 border rounded text-gray-300 bg-black focus:ring focus:ring-blue-300"
          placeholder="Enter quantity"
          required
        />
        <p>Condiments</p>
        <a className="cursor-pointer text-blue-500 hover:underline" onClick={addCondiment}>Add Condiment</a>
        <div id="condiments"></div>
        <button 
          onClick={addToHistory}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
        >
          Add to History
        </button>
      </form>
    </div>
  );
}