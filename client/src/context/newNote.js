import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useParams, useNavigate } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';


const NewNote = () => {
    const { courseId, topicId, noteId } = useParams();
    const { handlePostContext, handlePatchContextById, data, showToast } = useProviderContext();
    const navigate = useNavigate();
    const location = useLocation();


    const [editableFields, setEditableFields] = useState(noteId ? {} : {
        name: true,
        title: true,
        category: true,
        content: true,
    });

    const [validationSchema, setValidationSchema] = useState(yup.object());
    const [initialValues, setInitialValues] = useState({
        name: data?.note?.name || '',
        title: data?.note?.title || '',
        category: data?.note?.category || '',
        content: data?.note?.content || '',
        topic: {
            id: data?.note?.topic?.id || '',
            creator_id: data?.note?.topic?.creator_id || '',
            name: data?.note?.topic?.name || '',
        },
        references: data?.note?.references || [],
    });

    useEffect(() => {
        if (noteId && data && data.note) {
            const newInitialValues = {
                name: data.note.name || '',
                title: data.note.title || '',
                category: data.note.category || '',
                content: data.note.content || '',
                topic: {
                    id: data.note.topic?.id || '',
                    creator_id: data.note.topic?.creator_id || '',
                    name: data.note.topic?.name || '',
                },
                references: data.note.references || [],
            };

            let newValidationSchema = yup.object().shape({
                name: editableFields.name ? yup.string().required("Please enter a name") : yup.string(),
                title: editableFields.title ? yup.string().required("Please enter a title") : yup.string(),
                category: editableFields.category ? yup.string().required("Please enter a category") : yup.string(),
                content: editableFields.content ? yup.string().required("Please enter content") : yup.string(),
            });

            if (data.note.references && editableFields.references) {
                newValidationSchema = newValidationSchema.shape({
                    references: yup.array().of(
                        yup.object().shape({
                            id: yup.number().required(),
                            name: yup.string().required(),
                            // Add other fields as necessary
                        })
                    ).required("Please enter references"),
                });
            }

            setInitialValues(newInitialValues);
            setValidationSchema(newValidationSchema);
        }
    }, [noteId, courseId, topicId, data, editableFields]);

    const onSubmit = (values, { setSubmitting }) => {
        const editedValues = Object.keys(values).reduce((result, key) => {
            if (editableFields[key]) {
                result[key] = values[key];
            }
            return result;
        }, {});

        let promise;

        if (location.pathname.endsWith('/new')) {
            promise = handlePostContext('note', courseId, editedValues, topicId)
                .then((response) => {
                    showToast('success', 'Item created successfully');
                    setTimeout(() => {
                        navigate(`/courses/${courseId}/topics/${topicId}/notes/${response.note.id}`);
                    }, 2000); // 2 seconds delay
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                });
        } else if (noteId) {
            promise = handlePostContext('note', courseId, editedValues, topicId)
                .then((response) => {
                    showToast('success', 'Item created successfully');
                    setTimeout(() => {
                        // Use the noteId from the response to navigate
                        navigate(`/courses/${courseId}/topics/${topicId}/notes/${response.data.noteId}`);
                    }, 2000); // 2 seconds delay
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                });
        }

        if (promise) {
            promise.finally(() => {
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

    if (initialValues.references) {
        fieldInfo.push({ name: 'references', type: 'text', label: 'Reference', placeholder: 'Enter references' });
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                <Form>
                    {fieldInfo.map(field => (
                        <div key={field.name}>
                            {noteId && (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editableFields[field.name] || false}
                                            onChange={() => setEditableFields({ ...editableFields, [field.name]: !editableFields[field.name] })}
                                            name={field.name}
                                            color="primary"
                                        />
                                    }
                                    label="Editable"
                                />
                            )}
                            <TextField
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                label={field.label}
                                value={editableFields[field.name] ? (values[field.name] || initialValues[field.name]) : initialValues[field.name]}
                                onChange={event => setFieldValue(field.name, event.target.value)}
                                error={touched[field.name] && Boolean(errors[field.name])}
                                helperText={touched[field.name] && errors[field.name]}
                                fullWidth
                                multiline={field.name === 'content'}
                                maxRows={field.name === 'content' ? 10 : undefined}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: !editableFields[field.name],
                                }}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={isSubmitting}>{noteId ? 'Update' : 'Submit'}</button>
                </Form>
            )}
        </Formik>
    );
}

export default NewNote;