import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useAuth } from '../../context/AuthContext';
// import '../styles/Authentication.scss';

function Registration() {
    const { user, updateUser } = useAuth()
    // const location = useLocation();
    const navigate = useNavigate();

    
    const [isLogin, setIsLogin] = useState(true);

    const validationSchema = yup.object().shape({
        username: yup.string().required("Please enter a username"),
        password: yup.string().required("Please enter a password"),
        email: !isLogin ? yup.string().email().required("Please enter an email") : yup.mixed().notRequired(),
    });

    const initialValues = {
        username: '',
        email: '',
        password: '',
    };

    const onSubmit = (values) => {
        const requestUrl = isLogin ? "/login" : "/signup"
        const dataToSend = isLogin ? { username: values.username, password: values.password } : values;        fetch(requestUrl ? '/api/v1/login' : '/api/v1/signup', {
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
            <Field type='password' name='password' />
            <ErrorMessage name='password' component='div' />
            {!isLogin && (
                <>
                <label>Email:</label>
                <Field type='text' name='email' />
                <ErrorMessage name='email' component='div' />
                </>
            )}
            <button type='submit'>{isLogin ? 'Log In!' : 'Sign Up!'}</button>
            <button type='button' onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register Now!' : 'Login!'}</button>
            </Form>
        </Formik>
        </div>
    );
    }

export default Registration;