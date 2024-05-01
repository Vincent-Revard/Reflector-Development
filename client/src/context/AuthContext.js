import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react'
import { useToast } from './ToastContext'
import { useUnauthorized } from '..'
import CircularProgress from '@mui/material/CircularProgress';


const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(false)
  const { showToast } = useToast()
  const onUnauthorized = useUnauthorized()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [userData, setUserData] = useState(null);

  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  const logout = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    }
    try {
      fetch("/api/v1/logout", {
        method: "DELETE",
        headers: headers,
      })
        .then(resp => {
          if (resp.ok) {
            document.cookie = 'access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setUser(null)
            onUnauthorized()
          } 
        })
        .catch(error => {
          showToast(`error: ${error.message}`);
        });
    } catch (error) {
      showToast(`error: ${error.message}`);
    }
  }, [setUser, onUnauthorized, showToast]);

  useEffect(() => {
    const checkSession = async () => {
      setCheckingSession(true);
      let response;
      try {
        response = await fetch('http://localhost:3000/api/v1/check_session', {
          headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": getCookie('csrf_access_token'),
            'Authorization': `Bearer ${getCookie('csrf_access_token')}`
          },
        });
      } catch (error) {
        showToast(`error: ${error.message}`);
      }
      if (response && response.ok) {
        const data = await response.json();
        if (data.status !== '401') {
          const newUserData = {
            ...data,
            courses: data.courses.map(course => ({
              ...course,
              creating_user_id: course.creating_user_id
            })),
            topics: data.topics.map(topic => ({
              ...topic,
              creating_user_id: topic.creating_user_id
            }))
          };
          setUser(data);
          setUserData(newUserData);
        }
      } else {
        // Session check failed, try to refresh the session
        let refreshResponse;
        try {
          refreshResponse = await fetch("http://localhost:3000/api/v1/refresh", {
            method: "POST",
            headers: {
              "X-CSRFToken": getCookie('csrf_access_token'),
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('csrf_refresh_token')}, Bearer ${getCookie('access_token_cookie')}`
            }
          });
        } catch (error) {
          showToast(`error: ${error.message}`);
          logout();
        }

        if (refreshResponse && refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.msg === 'Token has expired') {
            logout();
          } else {
            setUser(refreshData);
          }
        }
      }
      setCheckingSession(false);
    };

    if (!sessionChecked) {
      checkSession();
      setSessionChecked(true)
    }
  }, [showToast, onUnauthorized, sessionChecked, logout]);


  const value = useMemo(() => ({
    user,
    updateUser: setUser,
    userData,
    updateUserData: setUserData,
    logout
  }), [user, setUser, logout, userData, setUserData]);

  return (
    <AuthContext.Provider value={value}>
      {checkingSession ? <CircularProgress color="secondary" size={50} /> : children}
    </AuthContext.Provider>
  )
}