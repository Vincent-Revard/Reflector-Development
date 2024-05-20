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
    const { user, updateUser, triggerRefresh } = useAuth();
    const { showToast } = useToast();
    const [data, setData] = useState({});
    const { postJSON, deleteJSON, patchJSON } = useFetchJSON();
    const location = useLocation();
    const navigate = useNavigate();
    // let currentPage = location.pathname.split('/')[1];
    let currentPage = location.pathname;
    if (currentPage === '/') {
        currentPage = '';
    } else if (currentPage.startsWith('/')) {
    currentPage = currentPage.slice(1);
    }
    // if (currentPage === 'profile') {
    //     currentPage = location.pathname.slice(1);
    // } else if (currentPage === 'courses') {
    //     currentPage = location.pathname.slice(1);
    // }

    function getApiEndpoint(currentPage) {
        let parts = currentPage.split('/');
        let apiEndpoint = parts.map(part => {
            if (['course', 'topic', 'note', 'profile'].includes(part)) {
                return part + 's';
            }
            return part;
        });
        debugger
        return apiEndpoint.join('/');
    }
    
    // function getApiEndpoint(currentPage) {
    //     let parts = currentPage.split('/');
    //     let apiEndpoint = parts.map((part, index) => {
    //         if (['course', 'topic', 'note', 'profile'].includes(part)) {
    //             // If the next part is a number, append 's' and the ID
    //             if (parts[index + 1] && !isNaN(parts[index + 1])) {
    //                 return part + 's/' + parts[index + 1];
    //             } else {
    //                 // If the next part is not a number or doesn't exist, just append 's'
    //                 return part + 's';
    //             }
    //         }
    //         return part;
    //     });
    //     // Remove duplicate IDs
    //     apiEndpoint = apiEndpoint.filter((part, index, self) =>
    //         !(!isNaN(part) && self.indexOf(part) !== index)
    //     );
    //     return apiEndpoint.join('/');
    // }

    currentPage = getApiEndpoint(currentPage)

    // if (currentPage === 'profile' || currentPage === 'course') {
    //     currentPage = getApiEndpoint(location.pathname.slice(1));
    // } else {
    //     currentPage = getApiEndpoint(currentPage);
    // }


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    useEffect(() => {
        let isMounted = true;
        const fetchData = async (retryCount = 0) => {
            if (user) {
                let abortController = new AbortController(); // Create an instance of AbortController
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/v1/${currentPage}`, { signal: abortController.signal }) // Pass the signal to the fetch request
                    const data = await res.json(); // Convert the response to JSON
                    if (!res.ok) { // If the response is not ok
                        throw new Error(data.message) // Throw an error with the server's error message
                    }
                    if (isMounted) {
                        setData(data)
                    }
                } catch (err) {
                    if (err.name === 'AbortError') {
                        showToast('error', `Fetch aborted: ${err.message}`) // Show the abort toast immediately
                    } else {
                        showToast('error', err.message) // Show the error toast immediately
                        if (err.message.includes('not found')) {
                            navigate('/'); // Navigate back a page
                        } else if (err.message.includes('500') && retryCount < 3) {
                            // Retry after 2 seconds if server error and retry count is less than 3
                            setTimeout(() => fetchData(retryCount + 1), 2000);
                        } else if (err.message.includes('401')) {
                            // Handle unauthorized error
                            showToast('error', err.message);
                            !user ? navigate('/') : triggerRefresh()
                        }
                    }
                } finally {
                    if (isMounted) {
                        setTimeout(() => {
                            showToast('success', `We've fetched your data!`) // Show the success toast after 4 seconds
                            setIsLoading(false);
                        }, 2000)
                    }
                }
                return () => {
                    abortController.abort(); // Abort the fetch request if the component is unmounted
                }
            }
        }
        fetchData();
    }, [currentPage, showToast, user, navigate, triggerRefresh])


    const handlePatchContext = async (updates) => {

        const { current_password, new_password, ...updatesWithoutPasswords } = updates;

        const prevProfileData = { ...data };

        const csrfToken = getCookie('csrf_access_token');

        setData({ ...data, ...updatesWithoutPasswords });
        try {
            const responseBody = await patchJSON(`/api/v1/${currentPage}`, updates, csrfToken);

            if (responseBody.message === 'Item updated successfully') {
                showToast('success', 'Item updated successfully');
            } else {
                throw new Error(responseBody.message || 'An error occurred');
            }
            return responseBody;
        } catch (err) {
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(prevProfileData);
        }
    }

    const handlePostContext = async (type, courseId, newContent, topicId = null) => {
        let url;
        const prevData = { ...data };

        switch (type) {
            case 'course':

                url = `/api/v1/courses/new`;
                break;
            case 'topic':
                url = `/api/v1/courses/${courseId}/topics/new`;
                break;
            case 'note':
                if (!topicId) {
                    throw new Error('Topic ID is required to post a new note');
                }
                url = `/api/v1/courses/${courseId}/topics/${topicId}/notes/new`;
                break;
            default:
                throw new Error('Invalid type');
        }

        try {
            const csrfToken = getCookie('csrf_access_token');
            const responseBody = await postJSON(url, newContent, csrfToken);

            if (responseBody.message.includes('created successfully')) {
                const updatedData = {
                    ...data,
                    [currentPage]: Array.isArray(data[currentPage]) ? [...data[currentPage], responseBody] : [responseBody]
                };
                setData(updatedData);
                showToast('success', 'Item created successfully');
            } else {
                throw new Error(responseBody.message || 'An error occurred');
            }
            return responseBody;
        } catch (err) {
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            setData(prevData);
            return { message: err.message }
        }
    }

    const handleEnroll = async (courseId, topicId = null, type) => {
        debugger
        let url = type === 'topics'
            ? `/api/v1/courses/${courseId}/topics/${topicId}/enroll`
            : `/api/v1/courses/${courseId}/enroll`;
        
        let prevData = { ...data };
        let updatedData;

        try {
            const csrfToken = getCookie('csrf_access_token');
            const data = topicId ? { courseId, topicId } : { courseId };
            const responseBody = await postJSON(url, data, csrfToken);

            if (responseBody.message === 'Operation successful') {
                showToast('success', 'Enrolled successfully');

                if (topicId) {
                    updatedData = {
                        ...prevData,
                        not_associated_topics: prevData.not_associated_topics.filter(topic => topic.id !== topicId),
                        associated_topics: [...prevData.associated_topics, prevData.not_associated_topics.find(topic => topic.id === topicId)]
                    };
                } else {
                    updatedData = {
                        ...prevData,
                        not_enrolled_courses: prevData.not_enrolled_courses.filter(course => course.id !== courseId),
                        enrolled_courses: [...prevData.enrolled_courses, prevData.not_enrolled_courses.find(course => course.id === courseId)]
                    };
                }

                setData(updatedData);
            } else {
                throw new Error(responseBody.message || 'An error occurred');
            }
            return responseBody;
        } catch (err) {
            showToast('error', typeof err.message === 'string' ? err.message : 'An error occurred');
            if (err.message === 'User not found' || err.message === 'Course not found' || err.message === 'Topic not found') {
                setData(prevData);
            }
            return err.message;
        }
    }

    const handleUnenroll = async (courseId, topicId = null) => {
        let url = topicId
            ? `/api/v1/courses/${courseId}/topics/${topicId}/unenroll`
            : `/api/v1/courses/${courseId}/unenroll`;

        let prevData = { ...data };
        let updatedData;

        if (topicId) {
            updatedData = {
                ...prevData,
                associated_topics: prevData.associated_topics.filter(topic => topic.id !== topicId),
                not_associated_topics: [...prevData.not_associated_topics, prevData.associated_topics.find(topic => topic.id === topicId)]
            };
        } else {
            updatedData = {
                ...prevData,
                enrolled_courses: prevData.enrolled_courses.filter(course => course.id !== courseId),
                not_enrolled_courses: [...prevData.not_enrolled_courses, prevData.enrolled_courses.find(course => course.id === courseId)]
            };
        }
        try {
            setData(updatedData);
            const csrfToken = getCookie('csrf_access_token');
            const data = topicId ? { courseId, topicId } : { courseId };
            const responseBody = await deleteJSON(url, csrfToken, null, data);

            if (responseBody.message === 'Operation successful') {
                showToast('success', 'Unenrolled successfully');
            } else {
                throw new Error(responseBody.message || 'An error occurred');
            }
            return responseBody;
        } catch (error) {
            showToast('error', typeof error.message === 'string' ? error.message : 'An error occurred');
            if (error.message === 'User-Topic association not found' || error.message === 'Course not found') {
                setData(prevData);
            }
            return error;
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
                showToast('success', 'User deleted successfully')
                updateUser(null)
                return;
            }
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
            itemToUpdate = data?.topic?.id === Number(topicId) ? data?.topic : null;
            url = `/api/v1/courses/${courseId}/topics/${topicId}`;
            updatedData = {
                ...prevData,
                topic: {
                    ...itemToUpdate,
                    ...updates
                }
            };
        } else {
            itemToUpdate = data?.course?.id === Number(courseId) ? data?.course : null;
            url = `/api/v1/courses/${courseId}`;
            updatedData = {
                ...prevData,
                course: {
                    ...itemToUpdate,
                    ...updates
                }
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
            const responseBody = await patchJSON(url, updatedData, csrfToken, Authorization);

            if (responseBody.message === 'Note updated successfully') {

                showToast('success', 'Item updated successfully');
            } else {
                throw new Error('An error occurred');
            }
            return responseBody;
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

            const responseBody = await deleteJSON(url, csrfToken, Authorization);

            if (responseBody.message === 'Item deleted successfully') {
                showToast('success', 'Item deleted successfully');
            } else {
                throw new Error('An error occurred');
            }
            return responseBody;
        } catch (error) {
            showToast('error', typeof error.message === 'string' ? error.message : 'An error occurred');
            setData(prevData);
            return error;
        }
    }

    return (
        <Context.Provider value={{
            data, handlePatchContext, handleDeleteContext, currentPage, showToast, handlePatchContextById, handleDeleteContextById, handlePostContext, handleEnroll, handleUnenroll, isLoading
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;