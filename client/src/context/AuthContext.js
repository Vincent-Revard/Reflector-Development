import React, { createContext, useState, useContext, useEffect, useMemo} from 'react'
import { useToast } from './ToastContext'
import { useUnauthorized } from '..'
const AuthContext = createContext()


export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { toast } = useToast()
  const onUnauthorized = useUnauthorized();

  const value = useMemo(() => ({
    user,
    updateUser: setUser,
  }), [user, setUser]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

    useEffect(() => {
      fetch('api/v1/check_session', {
        headers: {
          'X-CSRF-TOKEN': getCookie('CSRF-TOKEN'),
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            fetch("/refresh", {
              method: "POST",
              headers: {
                'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
              }
            })
            .then(resp => {
              if (resp.ok) {
                resp.json().then(setUser)
              } else {
                onUnauthorized();
              toast.error("Your session has expired. Please log in again.");
              }
            })
          }
        })
            .then(data => {
                value.updateUser(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [toast ,onUnauthorized, value]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}