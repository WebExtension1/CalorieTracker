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
  const [quantity, setQuantity] =  useState();
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
    // Master div
    const condiments = document.querySelector("#condiments");
    
    // New item div
    const newCondiment = document.createElement("div");
    condiments.appendChild(newCondiment);

    // Type
    const typeLabel = document.createTextNode("Type");
    newCondiment.appendChild(typeLabel);

    const typeInput = document.createElement("select");
    typeInput.setAttribute("name", "type[]")
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
    typeInput.required = true;
    newCondiment.appendChild(quantityInput);

    // Remove
    const remove = document.createElement("a");
    remove.textContent = "Remove";
    remove.addEventListener("click", function (event) {
      event.preventDefault();
      removeCondiment(newCondiment);
    });
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Link href="/">Back to Dashboard</Link>
      <p>{slug.replace("%20", " ")}</p>
      <form method="POST">
        <p>Quantity</p>
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          required
        />
        <p>Condiments</p>
        <a className="cursor-pointer" onClick={(addCondiment)}>Add Condiment</a>
        <div id="condiments"></div>
        <button onClick={(addToHistory)}>Add to History</button>
      </form>
    </div>
  );
}