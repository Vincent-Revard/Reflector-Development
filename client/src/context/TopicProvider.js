import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// TopicContext
const TopicContext = createContext();

export const useTopicContext = () => useContext(TopicContext);

const TopicProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [topics, setTopics] = useState([]);
    const { getJSON, deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'topics') {
            (async () => {
                try {
                    const res = await getJSON(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setTopics(data.data);
                        toast.success('Topics fetched successfully');
                    } else {
                        toast.error('Failed to fetch topics');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching topics');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);

    const handlePatchTopic = async (payload) => {
        // Implement patch logic here
    };

    const handleDeleteTopic = async (id) => {
        // Implement delete logic here
    };

    const handlePostTopic = async (newTopic) => {
        // Implement post logic here
    };

    return (
        <TopicContext.Provider value={{ topics, handlePatchTopic, handleDeleteTopic, handlePostTopic, currentPage }}>
            {children}
        </TopicContext.Provider>
    );
};

export default TopicProvider;
