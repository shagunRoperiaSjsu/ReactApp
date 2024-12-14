import axios from 'axios';

// Base URL of your backend server
const API_BASE_URL = 'http://localhost:8081';

// Type definitions for student and class
export interface Student {
    lastname: string;
    firstname: string;
    id: string;
    email1: string;
    email2: string;
}

export interface Class {
    classId: string;
}

// Types for request bodies
export interface AddStudentRequest {
    classId: string;
    semester: string;
    student: Student;
}

export interface GetFilesRequest {
    classId: string;
    semester: string;
}

export interface GetStudentsRequest {
    classId: string;
    semester: string;
}

export interface RemoveStudentRequest {
    classId: string;
    semester: string;
    studentId: string;
}

export interface EditStudentRequest {
    classId: string;
    semester: string;
    student: Student;
}

export interface SearchStudentRequest {
    id?: string;
    name?: string;
    email?: string;
}

// export interface CreateClassRequest {
//     classId: string;
// }

// export interface AddFileRequest {
//     classId: string;
//     semester: string;
//     fileName: string;
//     content: string;
// }

// Function to add a new student
export const addStudent = async (data: AddStudentRequest) => {
    const response = await axios.post(`${API_BASE_URL}/addStudent`, data);
    return response.data;
};

// Function to remove a student
export const removeStudent = async (data: RemoveStudentRequest) => {
    const response = await axios.delete(`${API_BASE_URL}/removeStudent`, { data });
    return response.data;
};

// Function to edit a student's information
export const editStudent = async (data: EditStudentRequest) => {
    const response = await axios.put(`${API_BASE_URL}/editStudent`, data);
    return response.data;
};

// Function to search for a student
export const searchStudent = async (params: SearchStudentRequest) => {
    const response = await axios.get(`${API_BASE_URL}/search`, { params });
    return response.data;
};

// // Function to create a new class (subdirectory)
// export const createClass = async (data: CreateClassRequest) => {
//     const response = await axios.post(`${API_BASE_URL}/createClass`, data);
//     return response.data;
// };

// // Function to add a new file to a subdirectory
// export const addFile = async (data: AddFileRequest) => {
//     const response = await axios.post(`${API_BASE_URL}/addFile`, data);
//     return response.data;
// };

// Function to get classes
export const fetchClasses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/classes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw error;
    }
};

// Function to get files or semesters
export const fetchFiles = async (classId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${classId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
    }
};

// Function to get students
export const fetchStudents = async (classId: string, filename: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${classId}/${filename}`);
        return response.data; // Assuming the backend returns the students as JSON
    } catch (error) {
        console.error("Error fetching students:", error);
        throw error;
    }
};

// Add a new class
export const addClass = async (classId: string) => {
    const response = await axios.post(`${API_BASE_URL}/addClass`, { classId });
    return response.data; // Assuming the response returns a success message
};

// Add a new file under a class
export const addFile = async ({ classId, semester, fileName, content }: { classId: string; semester: string; fileName: string; content: string; }) => {
    const response = await axios.post(`${API_BASE_URL}/addFile`, {
        classId,
        semester,
        fileName,
        content, // Leave content blank
    });
    return response.data; // Assuming the response returns a success message
};

export default {
    addStudent,
    fetchClasses,
    fetchFiles,
    fetchStudents,
    addClass,
    addFile,
    removeStudent,
    editStudent,
    searchStudent

};