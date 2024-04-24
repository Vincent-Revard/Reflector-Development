import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuizContext = createContext();

export const useQuizContext = () => useContext(QuizContext);

const QuizProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const { getJSON, deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'quizzes') {
            (async () => {
                try {
                    const res = await getJSON(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setQuizzes(data.data);
                        toast.success('Quizzes fetched successfully');
                    } else {
                        toast.error('Failed to fetch quizzes');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching quizzes');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);

    const handlePatchQuiz = async (payload) => {
        // Implement patch logic here
    };

    const handleDeleteQuiz = async (id) => {
        // Implement delete logic here
    };

    const handlePostQuiz = async (newQuiz) => {
        // Implement post logic here
    };

    return (
        <QuizContext.Provider value={{ quizzes, handlePatchQuiz, handleDeleteQuiz, handlePostQuiz, currentPage }}>
            {children}
        </QuizContext.Provider>
    );
};

export default QuizProvider;