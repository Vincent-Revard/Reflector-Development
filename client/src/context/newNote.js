import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useParams, useNavigate } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel, Typography, Box, Paper, Grid, Button, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';

const NewNote = () => {
    const { courseId, topicId, noteId } = useParams();
    const { handlePostContext, handlePatchContextById, data, showToast, isLoading } = useProviderContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [initialValues, setInitialValues] = useState({
        name: data?.note?.name || '',
        title: data?.note?.title || '',
        category: data?.note?.category || '',
        content: data?.note?.content || '',
    });

    // Add new state variables
    const [editEnabled, setEditEnabled] = useState(false);
    const [changedValues, setChangedValues] = useState({});

    const validationSchema = yup.object({
        name: yup.string().required("Please enter a name"),
        title: yup.string().required("Please enter a title"),
        category: yup.string().required("Please enter a category"),
        content: yup.string().required("Please enter content"),
    });

    useEffect(() => {
        if (location.pathname.endsWith('/edit') && noteId && data && data.note) {
            setInitialValues({
                name: data.note.name || '',
                title: data.note.title || '',
                category: data.note.category || '',
                content: data.note.content || '',
            });
        }
    }, [noteId, courseId, topicId, data, location.pathname]);

    useEffect(() => {
        setChangedValues(initialValues);
    }, [initialValues]);
 
    const onSubmit = (values, { setSubmitting }) => {
        if (location.pathname.endsWith('/new')) {
            handlePostContext('note', courseId, values, topicId)
                .then((response) => {
                    showToast('success', 'Item created successfully');
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/topics/${topicId}/notes/${response.note.id}`);
                    }, 2000); // 2 seconds delay
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        } else if (noteId) {
            handlePatchContextById(courseId, changedValues, topicId, noteId)
                .then((response) => {
                    showToast('success', 'Item updated successfully');
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/topics/${topicId}/notes/${noteId}`);
                    }, 2000); // 2 seconds delay
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
        { name: 'title', type: 'text', label: 'Title', placeholder: 'Enter title' },
        { name: 'category', type: 'text', label: 'Category', placeholder: 'Enter category' },
        { name: 'content', type: 'text', label: 'Content', placeholder: 'Enter content' },
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
                        <Typography variant="h4">Topic: {data?.note?.topic?.name}</Typography>
                    </Box>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            {fieldInfo.slice(0, 3).map(field => (
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
                                        multiline={field.name === 'content'}
                                        maxRows={field.name === 'content' ? 20 : undefined}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled={field.name !== 'content' && !editEnabled && !location.pathname.endsWith('/new')}
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
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <TextField
                            id="content"
                            name="content"
                            type="text"
                            label="Content"
                            value={values.content || initialValues.content}
                            onChange={event => {
                                setFieldValue('content', event.target.value);
                                setChangedValues(prev => ({ ...prev, content: event.target.value }));
                            }}
                            error={touched.content && Boolean(errors.content)}
                            helperText={touched.content && errors.content}
                            fullWidth
                            multiline
                            maxRows={20}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={false}
                        />
                    </Paper>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        {noteId ? 'Update' : 'Submit'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                </Form>
            )}
        </Formik>
    );
}
export default NewNote;