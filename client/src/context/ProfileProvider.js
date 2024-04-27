import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/useFetchJSON';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { useToast } from './ToastContext';
// ProfileContext
const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

const ProfileProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { logout, user } = useAuth();
    const {showToast} = useToast();
    const [profileData, setProfileData] = useState({});
    // const { deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const currentPage = location.pathname.slice(1);
    console.log('ProfileProvider mounted');
    console.log('currentPage:', currentPage);

    function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    }


    useEffect(() => {
        console.log('user:', user)
        if (currentPage.startsWith(`profile`) && user) {
            (async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/v1/${currentPage}`)
                    if (res.ok) {
                        const data = await res.json()
                        setProfileData(data)
                        console.log(data)
                        debugger
                        showToast('Profile fetched successfully')
                        setIsLoading(false);
                    // } else if (!res.ok) { // If unauthorized
                    //     const refreshRes = await fetch("/refresh", {
                    //         method: "POST",
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //             "X-CSRF-TOKEN": getCookie('csrf_refresh_token'),
                    //         }
                    //     })
                    //     if (refreshRes.ok) {
                    //         const data = await refreshRes.json()
                    //         setProfileData(data)
                    //         showToast('Profile fetched successfully')
                    //         setIsLoading(false);
                    //     } else {
                    //         throw new Error('Token refresh failed');
                        // }
                    }
                } catch (err) {
                    showToast(`An error occurred while fetching profile. ${err.message}`)
                    setIsLoading(false);
                }
            }
            )()
        }
    }
        , [currentPage, showToast, user])

    const handlePatchProfile = async (id, updates) => {
        debugger
        setProfileData(profileData.map(user => user.id === id ? { ...user, ...updates } : user))
        try {
            const csrfToken = getCookie('CSRF-TOKEN');
            const result = await fetch(`/api/v1/${currentPage}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(updates),
            });
            if (!result.ok) {
                throw new Error('Patch failed: status: ' + result.status)
            }
        } catch (err) {
            showToast(err.message);
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
            const csrfToken = getCookie('CSRF-TOKEN');
            const resp = await fetch(`/api/v1/${currentPage}/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            if (resp.status === 204) {
                showToast('User deleted successfully')
                logout()
            }
        } catch (err) {
            showToast(err)
            setProfileData(currentUsers => [...currentUsers, userToDelete])
        }
    }
    if (isLoading) {
        return <div>Loading...</div>; // Or your custom loading component
    }

    return (
        <ProfileContext.Provider value={{ profileData, handlePatchProfile, handleDeleteProfile, currentPage }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;