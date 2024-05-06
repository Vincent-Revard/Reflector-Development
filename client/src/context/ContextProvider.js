import React, { useState, useEffect, createContext, useContext } from 'react';
import { useFetchJSON } from '../utils/useFetchJSON';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useToast } from './ToastContext';
import { CircularProgress } from '@mui/material';



// ProfileContext
const Context = createContext();

export const useProviderContext = () => useContext(Context);

const ContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { logout, user, onUnauthorized } = useAuth();
    const { showToast } = useToast();
    const [data, setData] = useState({});
    const { postJSON, deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const navigate = useNavigate();
    let currentPage = location.pathname.split('/')[1];
    if (currentPage === 'profile') {
        currentPage = location.pathname.slice(1);
    } else if (currentPage === 'courses') {
        currentPage = location.pathname.slice(1);
    }
    const params = useParams();

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
                        showToast('success', 'Data Fetch Successful')
                        setIsLoading(false);
                    }
                } catch (err) {
                    if (err.name === 'AbortError') {
                        console.log('Fetch aborted')
                    } else {
                        showToast('error', err.message)
                        setIsLoading(false);
                    }
                }
            })()

            return () => {
                abortController.abort(); // Abort the fetch request if the component is unmounted
            }
        }
    }, [currentPage, showToast, user, params.noteId, params.topicId, params.courseId])



    const handlePatchContext = async (updates) => {
        // debugger
        const { current_password, new_password, ...updatesWithoutPasswords } = updates;
        // debugger
        const prevProfileData = { ...data };

        const csrfToken = getCookie('csrf_access_token');
        console.log(csrfToken)
        // setProfileData(profileData.map(user => user.id === id ? { ...user, ...updates } : user));
        // debugger
        try {
            setData({ ...data, ...updatesWithoutPasswords });
            const response = await patchJSON(`/api/v1/${currentPage}`, updates, csrfToken);
            return response
        } catch (err) {
            // debugger
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(prevProfileData);
        }
    }

    const handlePostContext = async (newContent) => {

        let pathname = location.pathname.endsWith('/new')
            ? location.pathname.slice(0, -4)
            : location.pathname;
        const url = `/api/v1${pathname}`;

        const prevData = { ...data };

        try {
            const csrfToken = getCookie('csrf_access_token');
            const response = await postJSON(url, newContent, csrfToken);
            const responseData = await response.json();

            if (response.ok) {
                const updatedData = {
                    ...data,
                    [currentPage]: [...data[currentPage], responseData]
                };
                setData(updatedData);
                showToast('success', 'Item created successfully');
            } else {
                showToast('error', responseData.message || 'An error occurred');
            }
            return response;
        } catch (err) {
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(prevData);
            return err.message;
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
            return resp.json().then(data => {
                if (resp.status === 204) {
                    showToast('success', 'User deleted successfully')
                    logout()
                }
            });
        } catch (err) {
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(userToDelete)
        }
    }

    //! CRUDById
        const handlePatchContextById = async (courseId, updates, topicId = null, noteId = null) => {
        let itemToUpdate;
        let url;
        let prevData = { ...data };
        let updatedData;
        debugger

            if (noteId) {
                itemToUpdate = data?.note?.id === Number(noteId) ? data?.note : null;
                url = `/api/v1/courses/${courseId}/topics/${topicId}/notes/${noteId}`;
                updatedData = {
                    ...prevData,
                    note: {
                        ...itemToUpdate,
                        ...updates
                    }
                };
            } else if (topicId) {
                itemToUpdate = data?.topics?.find(topic => topic.id === topicId);
                url = `/api/v1/courses/${courseId}/topics/${topicId}`;
                updatedData = {
                    ...prevData,
                    topics: prevData.topics.map(topic =>
                        topic.id === topicId ? { ...topic, ...updates } : topic
                    )
                };
            } else {
                itemToUpdate = data.courses?.find(course => course.id === courseId);
                url = `/api/v1/courses/${courseId}`;
                updatedData = {
                    ...prevData,
                    courses: prevData.courses.map(course =>
                        course.id === courseId ? { ...course, ...updates } : course
                    )
                };
            }

            if (!itemToUpdate) {
                showToast('error', 'Item not found');
                return;
            }

            try {
                setData(updatedData);
                const csrfToken = getCookie('csrf_access_token')
                const Authorization = `Bearer ${getCookie('access_token_cookie')}`
                const response = await patchJSON(url, updatedData, csrfToken, Authorization);
                if (response.ok) {
                    showToast('success', 'Item updated successfully');
                } else {
                    throw new Error('An error occurred');
                }
                return response;
            } catch (error) {
                showToast('error', typeof error.message === 'string' ? error.message : 'An error occurred');
                setData(prevData);
                return error;
            }
        }


        const handleDeleteContextById = async (courseId, topicId = null, noteId = null) => {
            let itemToDelete;
            let url;
            let prevData = { ...data };
            let updatedData;

            if (noteId) {
                itemToDelete = data?.note?.id === Number(noteId) ? data?.note : null;
                url = `/api/v1/courses/${courseId}/topics/${topicId}/notes/${noteId}`;
                updatedData = {
                    ...prevData,
                    note: null
                };
            } else if (topicId) {
                itemToDelete = data?.topics?.find(topic => topic.id === topicId);
                url = `/api/v1/courses/${courseId}/topics/${topicId}`;
                updatedData = {
                    ...prevData,
                    topics: prevData.topics.filter(topic => topic.id !== topicId)
                };
            } else {
                itemToDelete = data.courses?.find(course => course.id === courseId);
                url = `/api/v1/courses/${courseId}`;
                updatedData = {
                    ...prevData,
                    courses: prevData.courses.filter(course => course.id !== courseId)
                };
            }

            if (!itemToDelete) {
                showToast('error', 'Item not found');
                return;
            }

            try {
                setData(updatedData);
                const csrfToken = getCookie('csrf_access_token');
                const Authorization = `Bearer ${getCookie('access_token_cookie')}`;
                const response = await deleteJSON(url, csrfToken, Authorization);
                return response.then(res => {
                    if (res.ok) {
                        showToast('success', 'Item deleted successfully');
                        return res;
                    } else {
                        throw new Error('An error occurred');
                    }
                });
            } catch (error) {
                showToast('error', typeof error.message === 'string' ? error.message : 'An error occurred');
                setData(prevData);
                return error;
            }
        }

    return (
        <Context.Provider value={{
            data, handlePatchContext, handleDeleteContext, currentPage, showToast, handlePatchContextById, handleDeleteContextById, handlePostContext
        }}>
            {isLoading ? <CircularProgress /> : children}
        </Context.Provider>
    );
};

export default ContextProvider;