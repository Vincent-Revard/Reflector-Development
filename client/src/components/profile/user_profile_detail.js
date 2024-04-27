import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
// import { useUnauthorized } from '../..';

const UserProfileDetail = ({ username, email ,id,  handlePatchProfile, handleDeleteProfile} ) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();
    // const onUnauthorized = useUnauthorized();
    const { showToast } = useToast()
      
    const schema = yup.object().shape({
        username: yup.string().required('Please enter a username'),
        email: yup.string().email().required('Please enter an email'),
        current_password: yup.string().required('Please enter your current password'),
        new_password: yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            username: username || '',
            email: email || '',
            current_password: '',
            new_password: '',
        },
        validationSchema: schema,
        onSubmit: (values) => {
            if (showChangePassword && !values.new_password) {
                showToast('Please enter a new password');
                return;
            }
            const payload = {
                username: values.username,
                email: values.email,
                current_password: values.current_password,
            };


            if (showChangePassword) {
                payload.password_hash = values.new_password;
            }

          handlePatchProfile(id, payload)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Update failed');
                    }
                    debugger
                    showToast(showChangePassword ? 'Password updated successfully' : 'Profile updated successfully');
                    setIsEditMode(false);
                    setShowChangePassword(false);
                    formik.resetForm({
                        values: {
                            ...formik.values,
                            current_password: '',
                            new_password: '',
                        },
                    });
                })
                .catch((error) => {
                    if (typeof error.message === 'string') {
                        showToast(error.message);
                    } else if (typeof error === 'object' && error !== null) {
                        for (let field in error) {
                            error[field].forEach((message) => {
                                showToast(`${field}: ${message}`);
                            });
                        }
                    }
                    formik.resetForm({
                        values: {
                            ...formik.values,
                            current_password: '',
                            new_password: '',
                        },
                    });
                });
        },
        enableReinitialize: true,
    });

    const handleDelete = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');
        if (confirmDelete) {
            handleDeleteProfile(id);
            // onUnauthorized();
            navigate('/login');
        }
    };

    return (
        <div className="user-profile" key={id}>
            {!isEditMode ? (
                <div className="profile-info">
                    <h1>Profile</h1>
                    <p>
                        <span className="label">Username: </span>
                        <span className="value">{username}</span>
                    </p>
                    <p>
                        <span className="label">Email: </span>
                        <span className="value">{email}</span>
                    </p>
                    <div className="button-group">
                        <button className="edit-button" onClick={() => setIsEditMode(true)}>
                            Edit
                        </button>
                        <button className="edit-button" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
        ) : (
            <form onSubmit={formik.handleSubmit}>
                {!showChangePassword && (
                <>
                    <label>Username</label>
                    <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} autoComplete="username"/>
                    {formik.touched.username && formik.errors.username ? (
                        <div>{formik.errors.username}</div>
                    ) : null}

                    <label>Email</label>
                    <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} autoComplete="email"/>
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}
                </>
                )}

                <label>Current Password</label>
                <input type="password" placeholder="Current Password Required" name="current_password" value={formik.values.current_password} onChange={formik.handleChange} autoComplete="current-password" />
                {formik.touched.current_password && formik.errors.current_password ? (
                    <div>{formik.errors.current_password}</div>
                ) : null}

                {showChangePassword && (
                    <>
                        <label>New Password</label>
                        <input type="password" placeholder="Enter New Password" name="new_password" value={formik.values.new_password} onChange={formik.handleChange} autoComplete="new-password"/>
                        {formik.touched.new_password && formik.errors.new_password ? (
                            <div>{formik.errors.new_password}</div>
                        ) : null}
                    </>
                )}
                <button type="submit">Save</button>
                {showChangePassword ? null : <button type="button" onClick={() => setIsEditMode(false)}> Cancel</button>}
                <button type="button" onClick={() => setShowChangePassword(!showChangePassword)}>
                    {showChangePassword ? 'Cancel' : 'Change Password'}
                </button>
            </form>
        )}
    </div>
    );
};

export default UserProfileDetail;