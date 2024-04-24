import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// ProfileContext
const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

const ProfileProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const [profileData, setProfileData] = useState({});
    const { getJSON, deleteJSON, patchJSON, postJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);

    useEffect(() => {
        if (currentPage === 'profile') {
            (async () => {
                try {
                    const res = await getJSON(`/api/v1/${currentPage}`);
                    if (res.ok) {
                        const data = await res.json();
                        setProfileData(data.data);
                        toast.success('Profile data fetched successfully');
                    } else {
                        toast.error('Failed to fetch profile data');
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching profile data');
                }
            })();
        }
    }, [currentPage, updateUser, logout]);

    const handlePatchProfile = async (payload) => {
        // Implement patch logic here
    };

    const handleDeleteProfile = async () => {
        // Implement delete logic here
    };

    const handlePostProfile = async (newProfileData) => {
        // Implement post logic here
    };

    return (
        <ProfileContext.Provider value={{ profileData, handlePatchProfile, handleDeleteProfile, handlePostProfile, currentPage }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;