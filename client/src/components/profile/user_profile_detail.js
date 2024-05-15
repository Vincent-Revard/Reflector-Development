import { useProviderContext } from '../../context/ContextProvider';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Grid, Button, TextField, FormControlLabel, Switch, Dialog, DialogActions, DialogContent, DialogContentText, Box } from '@mui/material';

const UserProfileDetail = ({ data }) => {
  const { handlePatchContext, showToast, handleDeleteContext } = useProviderContext();
  const [editEnabled, setEditEnabled] = useState(false);
  const [passwordEditEnabled, setPasswordEditEnabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    handleDeleteContext().then(() => {
      setDialogOpen(false);
    });
  };

  const handleDeleteConfirm = () => {
    setDialogOpen(false);
  };

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
      <Box mt={2}>
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
                    <Box mt={2}>
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
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={2}>
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
                    </Box>
                  </Grid>
                  {editEnabled && (
                    <Grid item xs={12}>
                      <Box mt={2}>
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
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button variant="contained" color="primary" onClick={() => setEditEnabled(!editEnabled)}>
                        {editEnabled ? 'Disable Edit' : 'Enable Edit'}
                      </Button>
                    </Box>
                  </Grid>
                  {editEnabled && (
                    <Grid item xs={12}>
                    <Box mt={2}>
                      <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        Update
                      </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        )}
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={() => setPasswordEditEnabled(!passwordEditEnabled)}>
            {passwordEditEnabled ? 'Hide Password Update' : 'Show Password Update'}
          </Button>
        </Box>
        {passwordEditEnabled && (
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={onPasswordSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box mt={2}>
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
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box mt={2}>
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
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    Update
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
          Delete Profile
        </Button>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default UserProfileDetail;