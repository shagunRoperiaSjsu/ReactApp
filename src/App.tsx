import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import './styles/App.css'; // Ensure this path is correct
import ClassList from './components/ClassList';

import ClassDetails from './components/ClassDetails'; // Import ClassDetail
import { Link, } from 'react-router-dom';
import StudentDetails from './components/StudentDetails';
import SearchResults from './components/SearchResults';

const App: React.FC = () => {
    return (
        <Router>
        <div>
            {/* <Navigation /> */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/classes" element={<ClassList />} />
                <Route path="/:classId" element={<ClassDetails />} />
                <Route path="/:classId/:semesterId" element={<StudentDetails />} />
                <Route path="/search" element={<SearchResults />} /> {/* Route for search results */}
            </Routes>
        </div>
    </Router>
    );
};

const Home: React.FC = () => {
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to the search results page with query parameters
        navigate(`/search?id=${searchId}&name=${searchName}&email=${searchEmail}`);
    };
    return (
        <div>
            <h1>Welcome to the Student and Class Management System</h1>
            <div className="link-container">
                <p>
                    <Link to="/classes">Show Classes</Link>
                </p>
            </div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Name (First or Last)"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default App;

