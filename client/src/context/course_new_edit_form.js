import { Formik, Form } from 'formik';
import * as yup from "yup";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel, Typography, Box, Paper, Grid, Button, CircularProgress } from '@mui/material';

const CourseNewEdit = () => {
    const { courseId } = useParams();
    const { handlePostContext, handlePatchContextById, data, showToast, isLoading } = useProviderContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [initialValues, setInitialValues] = useState({
        name: data?.course?.name || '',
    });

    const [editEnabled, setEditEnabled] = useState(false);
    const [changedValues, setChangedValues] = useState({});

    const validationSchema = yup.object({
        name: yup.string().required("Please enter a name"),
    });

    useEffect(() => {
        if (location.pathname.endsWith('/edit') && courseId && data && data.course) {
            setInitialValues({
                name: data.course.name || '',
            });
        }
    }, [courseId, data, location.pathname]);

    useEffect(() => {
        setChangedValues(initialValues);
    }, [initialValues]);

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        if (location.pathname.endsWith('/new')) {
            try {
                const response = await handlePostContext('course', courseId, values);
                showToast('success', 'Item created successfully. You can now enroll this course!');
                if (response.message === 'Created successfully') {
                    resetForm(); // Clear the form
                    setTimeout(() => {
                        navigate(`/course/enroll`);
                    }, 2000);
                }
            } catch (error) {
                showToast('error', `Error: ${error.message}`);
            } finally {
                setSubmitting(false);
            }
        } else if (courseId) {
            handlePatchContextById(courseId, changedValues)
                .then((response) => {
                    showToast('success', 'Item updated successfully');
                    setTimeout(() => {
                        navigate(`/course/${courseId}`);
                    }, 2000);
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    };

    const fieldInfo = [
        { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
    ];

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                <Form>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4">Course: {data?.course?.name}</Typography>
                    </Box>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            {fieldInfo.map(field => (
                                <Grid item xs={12} sm={4} key={field.name}>
                                    <TextField
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        label={field.label}
                                        value={values[field.name] || initialValues[field.name]}
                                        onChange={event => {
                                            setFieldValue(field.name, event.target.value);
                                            setChangedValues(prev => ({ ...prev, [field.name]: event.target.value }));
                                        }}
                                        error={touched[field.name] && Boolean(errors[field.name])}
                                        helperText={touched[field.name] && errors[field.name]}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled={!editEnabled && !location.pathname.endsWith('/new')}
                                    />
                                </Grid>
                            ))}
                            {location.pathname.endsWith('/edit') && (
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={editEnabled}
                                                onChange={() => setEditEnabled(!editEnabled)}
                                                name="editEnabled"
                                                color="primary"
                                            />
                                        }
                                        label="Enable Edit"
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        {courseId ? 'Update' : 'Submit'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                </Form>
            )}
        </Formik>
    );
}
export default CourseNewEdit;