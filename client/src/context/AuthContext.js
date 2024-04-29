import React, { createContext, useState, useContext, useEffect, useMemo, useCallback} from 'react'
import { useToast } from './ToastContext'
import { useUnauthorized } from '..'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(false)
  const { showToast } = useToast()
  const onUnauthorized = useUnauthorized()
  const [sessionChecked, setSessionChecked] = useState(false)

  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  const csrfToken = getCookie('csrf_token')
  const refreshToken = getCookie('refresh_token_cookie')
  const access_token = getCookie('csrf_access_token')

  useEffect(() => {
    const checkSession = async () => {
      try {
        setCheckingSession(true);
        const response = await fetch('http://localhost:3000/api/v1/check_session', {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${access_token}`
          },
        });

        if (!response.ok) {
          throw new Error('Session check failed');
        }

        const data = await response.json();

        if (data.status !== '401') {
          setUser(data);
        }
      } catch (error) {
        showToast(`Error: ${error.message}`);
        onUnauthorized();
      } finally {
        setCheckingSession(false);
      }
    };

    if (!sessionChecked) {
      checkSession();
      setSessionChecked(true)
    }
  }, [showToast, onUnauthorized, csrfToken, sessionChecked]);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const refreshResponse = await fetch("http://localhost:3000/api/v1/refresh", {
          method: "POST",
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + refreshToken

          }
        });

        if (!refreshResponse.ok) {
          throw new Error('Session expired');
        }

        const refreshData = await refreshResponse.json();

        if (refreshData.msg === 'Token has expired') {
          onUnauthorized();
        } else {
          setUser(refreshData);
        }
      } catch (error) {
        showToast(`Error: ${error.message}`);
        onUnauthorized();
      }
    };

    if (user === null && !sessionChecked) {
      refreshSession();
    }
  }, [showToast, onUnauthorized, refreshToken, user, sessionChecked]);
  
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
    .catch(err => showToast(err))
  }, [setUser, onUnauthorized, showToast]);

  const value = useMemo(() => ({
    user,
    updateUser: setUser,
    logout
  }), [user, setUser, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}