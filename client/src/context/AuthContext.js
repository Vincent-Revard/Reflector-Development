import React, { createContext, useState, useContext, useEffect, useMemo, useCallback} from 'react'
import { useToast } from './ToastContext'
import { useUnauthorized } from '..'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { showToast } = useToast()
  const onUnauthorized = useUnauthorized();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const csrfToken = getCookie('CSRF-TOKEN')

useEffect(() => {
  fetch('http://localhost:3000/api/v1/check_session', {
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Session check failed');
      }
    })
    .then(data => {
      if (data.msg === 'Token has expired') {
        // Directly call the refresh endpoint instead of throwing an error
        return fetch("http://localhost:3000/api/v1/refresh", {
          method: "POST",
          headers: {
            'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
          }
        })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error('Token refresh failed');
          }
        })
        .then(setUser)
        .catch(error => {
          onUnauthorized();
          showToast(`Your session has expired. Please log in again. ${error.message}.`);
        });
      } else {
        setUser(data);
      }
    })
    .catch(error => {
      showToast(`Error: ${error.message}`);
    });
}, [showToast, onUnauthorized, csrfToken]);
  
  const logout = useCallback(() => {
// const csrfToken = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('csrf_access_token='))
//   .split('=')[1];    const jwtToken = getCookie('access_token')
//     console.log(jwtToken)
    const headers = {
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