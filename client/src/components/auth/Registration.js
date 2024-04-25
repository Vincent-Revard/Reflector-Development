import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
// import '../styles/Authentication.scss';
import styled from 'styled-components';



function Registration() {
    const { user, updateUser } = useAuth()
    const { showToast } = useToast();
    // const location = useLocation();
    const navigate = useNavigate();

    //! GET_COOKIE FUNCTION FROM LECTURE (NEAR END)
    
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
        const dataToSend = isLogin ? { username: values.username, password: values.password } : values;
        fetch('/api/v1' + requestUrl, {
            method: "POST",
            headers: {
                // "headers" : COOKIE FUNCTION
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
                showToast('success', 'Successfully logged in!');            });
            } else {
            res.json().then(error => {
            showToast('error', error.message);            });
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
                <StyledDiv>
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
            </StyledDiv>
        </Formik>
        </div>
    );
    }

export default Registration;


const StyledDiv = styled.div`
    display:flex;
    flex-direction:column;
    width: 400px;
    margin:auto;
    font-family:Arial;
    font-size:30px;
    input[type=submit]{
        background-color:var(--link);
        color: var(--bg);
        height:40px;
        font-family:Arial;
        font-size:30px;
        margin-top:10px;
        margin-bottom:10px;
    }
`;