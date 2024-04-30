import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/useFetchJSON';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
// ProfileContext
const Context = createContext();

export const useProviderContext = () => useContext(Context);


const ContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { logout, user, onUnauthorized } = useAuth();
    const { showToast } = useToast();
    const [data, setData] = useState({});
    const { deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const navigate = useNavigate();
    let currentPage = location.pathname.split('/')[1];
    if (currentPage === 'profile') {
        currentPage = location.pathname.slice(1);
    }

    console.log('currentPage:', currentPage);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }


    useEffect(() => {
        if (user) {
            let abortController = new AbortController(); // Create an instance of AbortController
            (async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/v1/${currentPage}`, { signal: abortController.signal }) // Pass the signal to the fetch request
                    if (res.ok) {
                        const data = await res.json()
                        setData(data)
                        console.log(data)
                        debugger
                        showToast('Data Fetch Successful')
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

    const handlePatchContext = async (updates) => {
        debugger
        const { current_password, new_password, ...updatesWithoutPasswords } = updates;
        debugger
        const prevProfileData = { ...data };

        const csrfToken = getCookie('csrf_access_token');
        console.log(csrfToken)
        // setProfileData(profileData.map(user => user.id === id ? { ...user, ...updates } : user));
        debugger
        try {
            setData({ ...data, ...updatesWithoutPasswords });
            const response = await patchJSON(`/api/v1/${currentPage}`, updates, csrfToken);
            return response
        } catch (err) {
            debugger
            showToast(typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(prevProfileData);
        }
    }

    const handleDeleteContext = async () => {
        // const userToDelete = profileData.find(user => user.id === id)
        let userToDelete = data;
        // setProfileData(profileData.filter(user => user.id !== id))
        setData({})
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
                onUnauthorized()
            }
        } catch (err) {
            showToast(err)
            setData(userToDelete)
        }
    }

    if (isLoading) {
        if (!user)
            return <div>Loading...</div>; //! add custom loading component from library
    }

    return (
        <Context.Provider value={{ data, handlePatchContext, handleDeleteContext, currentPage, showToast }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;