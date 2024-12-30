'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Profile() {
    const [profileData, setProfileData] = useState([]); // State to store the profile data
    const [loading, setLoading] = useState(true); // Loading state to show a loading spinner or message
    const [output, setOutput] = useState(""); // State to hold the name value
    const router = useRouter();

    // Fetch profile data when the component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await fetch("/api/users"); // Fetch data from the API endpoint
                const data = await res.json(); // Parse the JSON response
                setProfileData(data); // Update state with the fetched data
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading message or spinner while the data is being fetched
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Ignore null field
        const name = event.target.name.value; // Get the name value from the form input

        if (name) {
            router.push(`/profile/${name}`);
        } else {
            setOutput("");
        }
    };

    return (
        <div>
            <Link href="/">Dashboard</Link>
            <h1>Profile Page</h1>
            <form onSubmit={handleSubmit}>
                <p>Name</p>
                <input type="text" name="name" />
                <button type="submit">Find</button>
            </form>
            <div>
                {profileData.length === 0 ? (
                    <p>No profile data available.</p>
                ) : (
                    <table>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                        </tr>
                        {profileData.map((user) => (
                            <tr key={user.userID}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </table>
                )}
            </div>
        </div>
    );
}
