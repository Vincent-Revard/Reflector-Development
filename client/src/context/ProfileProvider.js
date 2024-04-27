import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/useFetchJSON';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { useToast } from './ToastContext';

// ProfileContext
const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

const ProfileProvider = ({ children }) => {
    const { updateUser, logout } = useAuth();
    const toast = useToast();
    const [profileData, setProfileData] = useState({});
    const { deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);
    console.log('ProfileProvider mounted');

    useEffect(() => {
        if (currentPage === 'profile') {
            (async () => {
                try {
                    const res = await fetch(`/api/v1/${currentPage}`)
                    if (res.ok) {
                        const data = await res.json()
                        setProfileData(data)
                        console.log(data)
                        debugger
                        toast.success('Profile fetched successfully')
                    } else {
                        toast.error('Failed to fetch profile')
                    }
                } catch (err) {
                    toast.error('An error occurred while fetching profile')
                }
            }
            )()
        }
    }
        , [currentPage, toast, profileData])

    const handlePatchProfile = async (id, updates) => {
        setProfileData(profileData.map(user => user.id === id ? { ...user, ...updates } : user))
        try {
            // await patchJSON(`/api/v1/${currentPage}`, id, updates)
            const result = await patchJSON(`/api/v1/${currentPage}`, id, updates)
            if (!result.ok) {
                throw new Error('Patch failed: status: ' + result.status)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message);
            setProfileData(currentProfiles => currentProfiles.map(profile =>
                profile.id === id ? { ...profile, ...revertUpdates(profile, updates) } : profile
            ))
        }

        function revertUpdates(user, updates) {
            const revertedUpdates = {}
            for (let key in updates) {
                revertedUpdates[key] = user[key]
            }
            return revertedUpdates
        }
    }

    const handleDeleteProfile = async (id) => {
        const userToDelete = profileData.find(user => user.id === id)
        setProfileData(profileData.filter(user => user.id !== id))
        try {
            const resp = await deleteJSON(`/api/v1/${currentPage}/${id}`)
            if (resp.status === 204) {
                console.log('User deleted successfully')
                logout()
            }
        } catch (err) {
            console.log(err)
            setProfileData(currentUsers => [...currentUsers, userToDelete])
        }
    }

    return (
        <ProfileContext.Provider value={{ profileData, handlePatchProfile, handleDeleteProfile, currentPage }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;