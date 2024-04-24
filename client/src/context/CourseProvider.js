import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseContext = createContext();

export const useCourseContext = () => useContext(CourseContext);

const CourseProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [courses, setCourses] = useState([]);
    const { getJSON, deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'courses') {
            (async () => {
                try {
                    const res = await getJSON(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCourses(data.data);
                        toast.success('Courses fetched successfully');
                    } else {
                        toast.error('Failed to fetch courses');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching courses');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);

    // Add similar handlers for patching, deleting, and posting courses

    const handlePatchCourse = async (payload) => {
        // Implement patch logic here
    };

    const handleDeleteCourse = async (id) => {
        // Implement delete logic here
    };

    const handlePostCourse = async (newCourse) => {
        // Implement post logic here
    };

    return (
        <CourseContext.Provider value={{ courses, handlePatchCourse, handleDeleteCourse, handlePostCourse, currentPage }}>
            {children}
        </CourseContext.Provider>
    );
};

export default CourseProvider;