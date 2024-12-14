// src/components/ClassDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFiles, addFile } from '../api/api'; // Ensure you have the right API functions
import { Link } from 'react-router-dom';
import './ClassDetails.css'; // Import the new CSS file

// interface ClassDetailProps {
//     classId: string;
//     onClassSelect: (classId: string | null) => void; // Callback to handle class selection
// }

const ClassDetail: React.FC = () => {
    const { classId } = useParams<{ classId: string }>(); // Get classId from URL params
    const navigate = useNavigate();
    const [semesters, setSemesters] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState<string>('');
    const [newSemester, setNewSemester] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);

        // Fetch semesters data
        const fetchSemestersData = async () => {
            if (!classId) return;
    
            try {
                const response = await fetchFiles(classId); // Fetching files based on classId
                if (Array.isArray(response)) {
                    setSemesters(response); // Update the semesters state
                } else {
                    setError("Unexpected response format.");
                }
            } catch (error) {
                setError("Failed to fetch semesters.");
            }
        };
    
        useEffect(() => {
            fetchSemestersData(); // Fetch semesters when component mounts or classId changes
        }, [classId]);

    const handleAddFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await addFile({
                classId: classId as string,
                semester: newSemester,
                fileName: newFileName,
                content: '', // Leave content blank
            });
            setMessage(response.message || 'File added successfully!');
            setNewFileName(''); // Reset new file fields
            setNewSemester('');
            // Refresh semesters after adding the file
            fetchSemestersData(); // Update the displayed list of semesters
        } catch (err) {
            console.error(err);
            setError('Failed to add file.');
        }
    };


    if (error) return <div>{error}</div>;

    return (
        <div>
            <h3>Semesters for {classId}</h3>
            <ul>
                {semesters.map(semester => (
                    <li key={semester}>
                    <Link to={`/${classId}/${semester}`}>{semester}</Link>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddFile}>
                <input 
                    type="text" 
                    value={newFileName} 
                    onChange={(e) => setNewFileName(e.target.value)} 
                    placeholder="File Name" 
                    required 
                />
                <input 
                    type="text" 
                    value={newSemester} 
                    onChange={(e) => setNewSemester(e.target.value)} 
                    placeholder="Semester Name" 
                    required 
                />
                <button type="submit">Add File</button>
            </form>
            {message && <div>{message}</div>}
            <button onClick={() => navigate('/classes')}>Back to Class List</button>
            
        </div>
    );
};

export default ClassDetail;
