import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

const NoteProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const { getJSON, deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'notes') {
            (async () => {
                try {
                    const res = await getJSON(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setNotes(data.data);
                        toast.success('Notes fetched successfully');
                    } else {
                        toast.error('Failed to fetch notes');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching notes');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);

    const handlePatchNote = async (payload) => {
        // Implement patch logic here
    };

    const handleDeleteNote = async (id) => {
        // Implement delete logic here
    };

    const handlePostNote = async (newNote) => {
        // Implement post logic here
    };

    return (
        <NoteContext.Provider value={{ notes, handlePatchNote, handleDeleteNote, handlePostNote, currentPage }}>
            {children}
        </NoteContext.Provider>
    );
};

export default NoteProvider;