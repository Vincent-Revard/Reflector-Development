import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useUnauthorized } from '../..';

function VerifyPage() {
    const { token } = useParams();
    const { updateUser, logout } = useAuth();
    const { showToast } = useToast();
    const onUnauthorized = useUnauthorized();
    const navigate = useNavigate();

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    useEffect(() => {
        const verifyUser = async () => {
            const headers = {
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            }

            try {
                const resp = await fetch(`/api/v1/verify/${token}`, {
                    method: 'PATCH', headers: headers
                });
                if (resp.ok) {
                    const user = await resp.json();
                    updateUser(user);
                    showToast('success', "Your account email has been verified.");
                    navigate('/');
                } else {
                    showToast('error', "Your session has expired. Please log in again.");
                    logout();
                }
            } catch (error) {
                console.error('error:', error);
            }
        }
        verifyUser();
    }, [token, updateUser, onUnauthorized, logout, showToast, navigate])

    return (
        <div>
            Verifying...
        </div>
    );
}

export default VerifyPage;