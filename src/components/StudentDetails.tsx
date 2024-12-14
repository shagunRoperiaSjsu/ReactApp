import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudents, removeStudent, editStudent,addStudent } from '../api/api'; // Adjust the import based on your file structure
import './StudentDetails.css';

interface Student {
    lastname: string;
    firstname: string;
    id: string;
    email1: string;
    email2: string;
}

const StudentDetails: React.FC = () => {
    const { classId, semesterId } = useParams<{ classId: string; semesterId: string }>();
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [newStudent, setNewStudent] = useState<Student>({
        lastname: '',
        firstname: '',
        id: '',
        email1: '',
        email2: ''
    });

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetchStudents(classId!, semesterId!); // Call the API with classId and filename
                console.log('API Response:', response); // Log the response
                setStudents(Array.isArray(response) ? response : []); // Check if response is an array
                setError(null); // Clear any existing error
            } catch (err) {
                console.error("Error fetching students:", err);
                setError('Failed to fetch student details.');
            }
        };

        if (classId && semesterId) {
            fetchStudentDetails(); // Fetch student details if classId and filename are present
        }
    }, [classId, semesterId]);

    const handleRemoveStudent = async (studentId: string) => {
        try {
            const data = {
                classId: classId!,
                semester: semesterId!,
                studentId
            };
            await removeStudent(data);
            // Refresh the student list after removal
            setStudents(students.filter(student => student.id !== studentId));
        } catch (err) {
            console.error("Error removing student:", err);
            setError('Failed to remove student.');
        }
    };

    const handleEditStudent = async () => {
        if (!editingStudent) return;
        try {
            const data = {
                classId: classId!,
                semester: semesterId!,
                student: { // This structure should match what your backend expects
                    lastname: editingStudent.lastname,
                    firstname: editingStudent.firstname,
                    id: editingStudent.id,
                    email1: editingStudent.email1,
                    email2: editingStudent.email2,
                },
            };
            console.log('Editing student data:', data);
            const response = await editStudent(data);
            console.log('Edit student API response:', response);

            const updatedStudents = students.map(s => (s.id === editingStudent.id ? editingStudent : s));
            setStudents(updatedStudents);
            console.log('Updated students:', updatedStudents);
            
            setEditingStudent(null);
        } catch (err) {
            console.error("Error editing student:", err);
            setError('Failed to edit student details.');
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                classId: classId!,
                semester: semesterId!,
                student: newStudent,
            };
            await addStudent(data);
            setStudents([...students, newStudent]); // Add the new student to the list
            setNewStudent({
                lastname: '',
                firstname: '',
                id: '',
                email1: '',
                email2: ''
            }); // Reset the new student form
        } catch (err) {
            console.error("Error adding student:", err);
            setError('Failed to add student.');
        }
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent({ ...student });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingStudent) {
            setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
        }else {
            setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        handleEditStudent();
    };


    return (
        <div>
            <h2>Students in {classId} - {semesterId}</h2>
            {error && <div className="error">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>ID</th>
                        <th>Email 1</th>
                        <th>Email 2</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                            students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.lastname}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.id}</td>
                                    <td>{student.email1}</td>
                                    <td>{student.email2}</td>
                                    <td>
                                        <button onClick={() => handleRemoveStudent(student.id)}>Remove</button>
                                        <button onClick={() => handleEditClick(student)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>No students found.</td>
                            </tr>
                        )}  
                </tbody>
            </table>
            {editingStudent && (
                <div className="edit-form">
                    <h3>Edit Student</h3>
                    <form onSubmit={handleSave}>
                        <input
                            type="text"
                            name="lastname"
                            value={editingStudent.lastname}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            required
                        />
                        <input
                            type="text"
                            name="firstname"
                            value={editingStudent.firstname}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="id"
                            value={editingStudent.id}
                            onChange={handleInputChange}
                            placeholder="ID"
                            required
                            disabled // Disable editing of ID
                        />
                        <input
                            type="email"
                            name="email1"
                            value={editingStudent.email1}
                            onChange={handleInputChange}
                            placeholder="Email 1"
                            required
                        />
                        <input
                            type="email"
                            name="email2"
                            value={editingStudent.email2}
                            onChange={handleInputChange}
                            placeholder="Email 2"
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
                    </form>
                </div>
            )}
        
        <div className="add-form">
                <h3>Add New Student</h3>
                <form onSubmit={handleAddStudent}>
                    <input
                        type="text"
                        name="lastname"
                        value={newStudent.lastname}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                    />
                    <input
                        type="text"
                        name="firstname"
                        value={newStudent.firstname}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                    />
                    <input
                        type="text"
                        name="id"
                        value={newStudent.id}
                        onChange={handleInputChange}
                        placeholder="ID"
                        required
                    />
                    <input
                        type="email"
                        name="email1"
                        value={newStudent.email1}
                        onChange={handleInputChange}
                        placeholder="Email 1"
                        required
                    />
                    <input
                        type="email"
                        name="email2"
                        value={newStudent.email2}
                        onChange={handleInputChange}
                        placeholder="Email 2"
                    />
                    <button type="submit">Add Student</button>
                </form>
            </div>

        </div>
    );
};

export default StudentDetails;
