import { useProviderContext } from '../../context/ContextProvider';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Grid, Button, TextField, FormControlLabel, Switch } from '@mui/material';

const UserProfileDetail = ({ data }) => {
  const { handlePatchContext, showToast } = useProviderContext();
  const [editEnabled, setEditEnabled] = useState(false);
  const [passwordEditEnabled, setPasswordEditEnabled] = useState(false);

  const [initialValues, setInitialValues] = useState({
    username: data?.username,
    email: data?.email,
    current_password: '',
  });

  const passwordInitialValues = {
    current_password: '',
    new_password: '',
  };

  const validationSchema = yup.object({
    username: yup.string().required("Please enter a username"),
    email: yup.string().email().required("Please enter an email"),
    current_password: yup.string().required("Please enter your current password"),
  });

  const passwordValidationSchema = yup.object({
    current_password: yup.string().required("Please enter your current password"),
    new_password: yup.string().required("Please enter your new password"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    const dataToSend = {
      ...values,
      username: initialValues.username,
    };

    handlePatchContext(dataToSend)
      .then((response) => {
        showToast('success', 'Profile updated successfully');
        setEditEnabled(false);
      })
      .catch((error) => {
        showToast('error', error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const onPasswordSubmit = (values, { setSubmitting }) => {
    const dataToSend = {
      username: initialValues.username,
      email: initialValues.email,
      current_password: values.current_password,
      password: values.new_password,
    };

    handlePatchContext(dataToSend)
      .then((response) => {
        showToast('success', 'Password updated successfully');
      })
      .catch((error) => {
        showToast('error', error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <>
      {!passwordEditEnabled && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    value={values.username}
                    onChange={event => setFieldValue('username', event.target.value)}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    fullWidth
                    disabled={!editEnabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    value={values.email}
                    onChange={event => setFieldValue('email', event.target.value)}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    disabled={!editEnabled}
                  />
                </Grid>
                {editEnabled && (
                  <Grid item xs={12}>
                    <TextField
                      id="current_password"
                      name="current_password"
                      type="password"
                      label="Current Password"
                      value={values.current_password}
                      onChange={event => setFieldValue('current_password', event.target.value)}
                      error={touched.current_password && Boolean(errors.current_password)}
                      helperText={touched.current_password && errors.current_password}
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={() => setEditEnabled(!editEnabled)}>
                    {editEnabled ? 'Disable Edit' : 'Enable Edit'}
                  </Button>
                </Grid>
                {editEnabled && (
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                      Update
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Form>
          )}
        </Formik>
      )}
      <Button variant="contained" color="secondary" onClick={() => setPasswordEditEnabled(!passwordEditEnabled)}>
        {passwordEditEnabled ? 'Hide Password Update' : 'Show Password Update'}
      </Button>
      {passwordEditEnabled && (
        <Formik
          initialValues={passwordInitialValues}
          validationSchema={passwordValidationSchema}
          onSubmit={onPasswordSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid item xs={12}>
                <TextField
                  id="current_password"
                  name="current_password"
                  type="password"
                  label="Current Password"
                  value={values.current_password}
                  onChange={event => setFieldValue('current_password', event.target.value)}
                  error={touched.current_password && Boolean(errors.current_password)}
                  helperText={touched.current_password && errors.current_password}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="new_password"
                  name="new_password"
                  type="password"
                  label="New Password"
                  value={values.new_password}
                  onChange={event => setFieldValue('new_password', event.target.value)}
                  error={touched.new_password && Boolean(errors.new_password)}
                  helperText={touched.new_password && errors.new_password}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Update
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
export default UserProfileDetail;