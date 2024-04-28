import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/useFetchJSON';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
// ProfileContext
const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);


const ProfileProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { logout, user } = useAuth();
    const {showToast} = useToast();
    const [profileData, setProfileData] = useState({});
    const { deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = location.pathname.slice(1);
    console.log('ProfileProvider mounted');
    console.log('currentPage:', currentPage);

    function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    }


    useEffect(() => {
        console.log('showToast in effect:', showToast);
        console.log('user:', user)
        if (currentPage.startsWith(`profile`) && user) {
            let abortController = new AbortController(); // Create an instance of AbortController
            (async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/v1/${currentPage}`, { signal: abortController.signal }) // Pass the signal to the fetch request
                    if (res.ok) {
                        const data = await res.json()
                        setProfileData(data)
                        console.log(data)
                        debugger
                        showToast('Profile fetched successfully')
                        setIsLoading(false);
                    }
                } catch (err) {
                    if (err.name === 'AbortError') {
                        console.log('Fetch aborted')
                    } else {
                        showToast(`An error occurred while fetching profile. ${err.message}`)
                        setIsLoading(false);
                    }
                }
            })()

            return () => {
                abortController.abort(); // Abort the fetch request when the component unmounts or the dependencies change
            }
        }
    }, [currentPage, showToast, user])

    const handlePatchProfile = async (updates) => {
        debugger
        const { current_password, new_password, ...updatesWithoutPasswords } = updates;
        debugger
        const prevProfileData = { ...profileData };

        const csrfToken = getCookie('csrf_access_token');
        console.log(csrfToken)
        // setProfileData(profileData.map(user => user.id === id ? { ...user, ...updates } : user));
        debugger
        try {
            setProfileData({ ...profileData, ...updatesWithoutPasswords });
            const response = await patchJSON(`/api/v1/${currentPage}`, updates, csrfToken);
            return response
        } catch (err) {
            debugger
            showToast(typeof err.message === 'string' ? err.message : 'An error occurred');
            setProfileData(prevProfileData);
        }
    }

// function revertUpdates(user, updates) {
//         debugger
//         const revertedUpdates = {};
//         for (let key in updates) {
//             revertedUpdates[key] = user[key];
//         }
//         debugger
//         return revertedUpdates;
//     };

    const handleDeleteProfile = async () => {
        // const userToDelete = profileData.find(user => user.id === id)
        let userToDelete = profileData;
        // setProfileData(profileData.filter(user => user.id !== id))
        setProfileData({})
        navigate('/')
        try {
            const csrfToken = getCookie('csrf_access_token');
            const resp = await fetch(`/api/v1/${currentPage}`, {
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
            setProfileData(userToDelete)
        }
    }
    if (isLoading) {
        return <div>Loading...</div>; // Or your custom loading component
    }

    return (
        <ProfileContext.Provider value={{ profileData, handlePatchProfile, handleDeleteProfile, currentPage, showToast }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;