import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react'
import { useToast } from './ToastContext'
import { useUnauthorized } from '..'
import CircularProgress from '@mui/material/CircularProgress';

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(false)
  const [checkingRefresh, setCheckingRefresh] = useState(false)
  const { showToast } = useToast()
  const onUnauthorized = useUnauthorized()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => !prev);
  }, []);

  const logout = useCallback(() => {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    }
    fetch("/api/v1/logout", {
      method: "DELETE",
      headers: headers,
    })
      .then(resp => {
        if (resp.ok) {
          document.cookie = 'access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          setUser(null)
          onUnauthorized()
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch(err => showToast(err.message))
  }, [setUser, onUnauthorized, showToast]);

  const value = useMemo(() => ({
    user,
    updateUser: setUser,
    logout,
    checkingRefresh,
    triggerRefresh
  }), [user, setUser, logout, checkingRefresh, triggerRefresh ]);

  const checkSession = useCallback(async () => {
    setCheckingSession(true);
    let response;
    try {
      response = await fetch('/api/v1/check_session', {
        headers: {
          'Content-Type': 'application/json',
          "X-CSRF-TOKEN": getCookie('csrf_access_token'),
          'Authorization': `Bearer ${getCookie('csrf_access_token')}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status !== '401') {
          setUser(data);
        }
      }
    } catch (error) {
      console.log(error)
    }
    if (!response || !response.ok) {
      setCheckingRefresh(true); // Set checkingRefresh to true when starting the refresh operation
      let refreshResponse;
      try {
        refreshResponse = await fetch("/api/v1/refresh", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            "X-CSRF-TOKEN": (getCookie('csrf_access_token'), getCookie('csrf_refresh_token')),
            'Authorization': `Bearer ${getCookie('refresh_token_cookie')}`
          },
        });
        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json();
          showToast(`error`, `${errorData.msg}`);
        } else {
          const refreshData = await refreshResponse.json();
          if (refreshData.msg === 'Token has expired') {
            setUser(null)
            onUnauthorized()
          } else {
            setUser(refreshData);
          }
        }
      } catch (error) {
        showToast(`error`, `${error.message}`);
        setUser(null)
        onUnauthorized()
        try {
          logout();
        } catch (logoutError) {
          showToast(`error`, `${logoutError.message}`);
        }
      }
      setCheckingRefresh(false); // Set checkingRefresh to false when the refresh operation is complete
    }
    setCheckingSession(false);
  }, [showToast, logout, onUnauthorized]);

  useEffect(() => {
    if (!sessionChecked || refreshTrigger) {
      checkSession();
      setSessionChecked(true)
    }
  }, [checkSession, sessionChecked, refreshTrigger]);
  
  return (
    <AuthContext.Provider value={value}>
      {checkingSession ? <CircularProgress color="secondary" size={50} /> : children}
    </AuthContext.Provider>
  )
}