import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel, Typography, Box, Paper, Grid, Button, CircularProgress } from '@mui/material';

const TopicNewEdit = () => {
    const { courseId, topicId } = useParams();
    const { handlePostContext, handlePatchContextById, data, showToast, isLoading } = useProviderContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [initialValues, setInitialValues] = useState({
        name: data?.topic?.name || '',
    });

    const [editEnabled, setEditEnabled] = useState(false);
    const [changedValues, setChangedValues] = useState({});

    const validationSchema = yup.object({
        name: yup.string().required("Please enter a name"),
    });

    useEffect(() => {
        if (location.pathname.endsWith('/edit') && topicId && data && data.topic) {
            setInitialValues({
                name: data.topic.name || '',
            });
        }
    }, [topicId, data, location.pathname]);

    useEffect(() => {
        setChangedValues(initialValues);
    }, [initialValues]);

    const onSubmit = (values, { setSubmitting }) => {
        if (location.pathname.endsWith('/new')) {
            handlePostContext('topic', courseId, values)
                .then((response) => {
                    showToast('success', 'Item created successfully');
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/topics/${response.topic.id}`);
                    }, 2000);
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        } else if (topicId) {
            handlePatchContextById(topicId, changedValues)
                .then((response) => {
                    showToast('success', 'Item updated successfully');
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/topics/${topicId}`);
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
                        <Typography variant="h4">Topic: {data?.topic?.name}</Typography>
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
                        {topicId ? 'Update' : 'Submit'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                </Form>
            )}
        </Formik>
    );
}
export default TopicNewEdit;