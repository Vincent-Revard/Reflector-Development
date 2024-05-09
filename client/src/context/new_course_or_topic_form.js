import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useParams, useNavigate } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { TextField, Switch, FormControlLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';

const NewCourseOrTopic = ({ type }) => {
    const { id } = useParams();
    const { handlePostContext, handlePatchContextById, data, showToast } = useProviderContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [editableFields, setEditableFields] = useState(id ? {} : {
        name: true,
        creator_id: true,
    });

    const [validationSchema, setValidationSchema] = useState(yup.object());
    const [initialValues, setInitialValues] = useState({
        name: data?.[type]?.name || '',
        creator_id: data?.[type]?.creator_id || '',
    });

    useEffect(() => {
        if (id && data && data[type]) {
            const newInitialValues = {
                name: data[type].name || '',
                creator_id: data[type].creator_id || '',
            };

            let newValidationSchema = yup.object().shape({
                name: editableFields.name ? yup.string().required("Please enter a name") : yup.string(),
                creator_id: editableFields.creator_id ? yup.number().required("Please enter a creator id") : yup.number(),
            });

            setInitialValues(newInitialValues);
            setValidationSchema(newValidationSchema);
        }
    }, [id, data, editableFields, type]);

    const onSubmit = (values, { setSubmitting }) => {
        const editedValues = Object.keys(values).reduce((result, key) => {
            if (editableFields[key]) {
                result[key] = values[key];
            }
            return result;
        }, {});

        let promise;

        if (location.pathname.endsWith('/new')) {
            promise = handlePostContext(type, editedValues)
                .then((response) => {
                    showToast('success', 'Item created successfully');
                    setTimeout(() => {
                        navigate(`/${type}s/${response[type].id}`);
                    }, 2000); // 2 seconds delay
                })
                .catch(error => {
                    showToast('error', `Error: ${error.message}`);
                });
        } else if (id) {
            promise = handlePatchContextById(type, id, editedValues)
                .then((response) => {
                    showToast('success', 'Item updated successfully');
                    setTimeout(() => {
                        navigate(`/${type}s/${response.data.id}`);
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
        { name: 'name', type: 'text', label: 'Name', placeholder: `Enter ${type} name` },
    ];

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
                            {id && (
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: !editableFields[field.name],
                                }}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={isSubmitting}>{id ? 'Update' : 'Submit'}</button>
                </Form>
            )}
        </Formik>
    );
}

export default NewCourseOrTopic;