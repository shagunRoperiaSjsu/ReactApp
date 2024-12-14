// src/components/ClassList.tsx

import React, { useEffect, useState } from 'react';
import { fetchClasses, addClass } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import ClassDetails from '../components/ClassDetails'
import './ClassList.css'; // Import the new CSS file


const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<string[]>([]); // Initialize as an empty array
    const [error, setError] = useState<string | null>(null);
    const [newClassName, setNewClassName] = useState<string>(''); // State for new class input
    const [message, setMessage] = useState<string | null>(null); // State for success message
    const [selectedClass, setSelectedClass] = useState<string | null>(null); // Track selected class
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchClassesData = async () => {
            try {
                const response = await fetchClasses(); // Call the API to fetch class names
                if (Array.isArray(response)) {
                    setClasses(response); // Set the state with the fetched class names if it's an array
                } else {
                    setError("Unexpected response format."); // Handle unexpected response
                }
            } catch (error) {
                setError("Failed to fetch classes."); // Handle any errors
            }
        };

        fetchClassesData();
    }, []);

    const handleAddClass = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setMessage(null); // Reset previous messages
        setError(null); // Reset previous error messages

        try {
            const response = await addClass(newClassName); // Pass the class name directly
            setClasses((prevClasses) => [...prevClasses, newClassName]); // Update class list
            setMessage(response.message || 'Class added successfully!'); // Show success message
            setNewClassName(''); // Clear input field
        } catch (err) {
            console.error(err);
            setError('Failed to add class.'); // Handle error message
        }
    };

    const handleClassSelect = (classId: string) => {
        setSelectedClass(classId); // Set selected class
        navigate(`/${classId}`); // Navigate to class detail
    };

    if (error) return <div>{error}</div>; // Display error if there's any

    return (
        <div>
            <h2>Class List</h2>
           <ul>
                {classes.map(classId => (
                    <li key={classId}>
                        <button onClick={() => handleClassSelect(classId)}>{classId}</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddClass}>
                <input 
                    type="text" 
                    value={newClassName} 
                    onChange={(e) => setNewClassName(e.target.value)} 
                    placeholder="Enter class name" 
                    required 
                />
                <button type="submit">Add Class</button>
            </form>
            {message && <div>{message}</div>} {/* Display success message */}
        </div>
    );
};

export default ClassList;
