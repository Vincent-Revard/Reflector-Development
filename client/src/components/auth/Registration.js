import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useAuth } from '../../context/AuthContext';
// import '../styles/Authentication.scss';

function Registration() {
    const { user, updateUser } = useAuth()
    const location = useLocation();
    const navigate = useNavigate();
    
    const signUp = location.pathname === '/signup';

    const validationSchema = yup.object().shape({
        username: yup.string().required("Please enter a username"),
        password_hash: yup.string().required("Please enter a password"),
        email: signUp ? yup.string().email().required("Please enter an email") : yup.mixed().notRequired(),
    });

    const initialValues = {
        username: '',
        email: '',
        password_hash: '',
    };

    const onSubmit = (values) => {
        const dataToSend = signUp ? values : { username: values.username, password_hash: values.password_hash };
        fetch(signUp ? '/api/v1/signup' : '/api/v1/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        })
        .then(res => {
            if (res.ok) {
            res.json().then(user => {
                console.log(user);
                updateUser(user);
                navigate('/');
            });
            } else {
            res.json().then(error => {
                console.error(error);
            });
            }
        });
    };

    if (user) {
        return <h2>You are already signed in!</h2>;
    }

    return (
        <div className="authentication">
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form className="authentication-form">
            <label>Username:</label>
            <Field type='text' name='username' />
            <ErrorMessage name='username' component='div' />
            <label>Password:</label>
            <Field type='password' name='password_hash' />
            <ErrorMessage name='password_hash' component='div' />
            {signUp && (
                <>
                <label>Email:</label>
                <Field type='text' name='email' />
                <ErrorMessage name='email' component='div' />
                </>
            )}
            <button type='submit'>{signUp ? 'Sign Up!' : 'Log In!'}</button>
            </Form>
        </Formik>
        </div>
    );
    }

export default Registration;