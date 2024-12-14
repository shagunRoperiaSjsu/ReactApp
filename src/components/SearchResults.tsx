import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchStudent } from '../api/api'; // Import your fetch function from api.ts
import './SearchResults.css'; // Import the new CSS file

const SearchResults: React.FC = () => {
    const location = useLocation();
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        const name = query.get('name');
        const email = query.get('email');

        // Call fetchResults with current search parameters
        searchStudent({ id: id || undefined, name: name || undefined, email: email || undefined })
            .then(data => {
                setResults(data);
                setError(null);
            })
            .catch(err => {
                setError('Error fetching search results');
                console.error(err);
            });
    }, [location]);

    return (
        <div>
            <h1>Search Results</h1>
            {error && <p>{error}</p>}
            {results.length > 0 ? (
                <table className="results-table">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Semester</th>
                        <th>Student Name</th>
                        <th>ID</th>
                        <th>Emails</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.classId}</td>
                            <td>{result.semester}</td>
                            <td>{result.student.firstName} {result.student.lastName}</td>
                            <td>{result.student.studentId}</td>
                            <td>{result.student.studentEmail1}, {result.student.studentEmail2}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>Not Found</p>
        )}
        </div>
    );
};

export default SearchResults;
