import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormComponent from '../components/form/form_component';
import { Link, useNavigate } from 'react-router-dom'
import NewNote from './newNote';

const NoteCard = ({ data, handlePatchContext, handlePostContext, handleDeleteContext, showToast, courseId, topicId }) => {
    const { name, id } = data;
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationSchema, setValidationSchema] = useState(null);
    const initialFieldInfo = [
        { name: 'name', type: 'text', placeholder: 'Name', editable: true },
    ];
    const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);

    const handleEditNote = (noteId) => {
        navigate(`/courses/${courseId}/topics/${topicId}/notes/new`);
    };

    const handleNewNote = () => {
        return <NewNote />;
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        cancelEdit()
    };

    const toggleEditable = (fieldName) => {
        setFieldInfo(fieldInfo.map(field =>
            field.name === fieldName
                ? { ...field, editable: !field.editable }
                : field
        ))
    }

    const toggleEditMode = () => {
        setIsEditMode(true);
        setFieldInfo([
            { name: 'name', type: 'text', placeholder: 'Name', label: `Update Name (current: ${name})`, editable: false },
        ]);
        setValidationSchema(yup.object().shape({
            name: yup.string().required('Please enter a name'),
        }));
    }

    const handleError = (error) => {
        if (typeof error === 'string') {
            showToast('error', error);
        } else if (error && typeof error.message === 'string') {
            showToast('error', error.message);
        } else if (typeof error === 'object' && error !== null) {
            for (let field in error) {
                error[field].forEach((message) => {
                    showToast('error', `${field}: ${message}`);
                });
            }
        }
    }

    const [formValues, setFormValues] = useState({
        name: name || '',
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        const payload = {
            id: id,
            name: values.name,
        };

        handlePatchContext(payload)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Update failed');
                }

                showToast('success', 'Card updated successfully');
                setIsEditMode(false);
                setFormValues({
                    name: res.data.name,
                });
                resetForm({
                    values: {
                        ...values,
                    },
                });
            })
            .catch((error) => {
                handleError(error);
                setFormValues({
                    name: name || '',
                });
            })
            .finally(() => {
                setSubmitting(false);
                setIsModalOpen(false);
            });
    }

    const cancelEdit = () => {
        setIsEditMode(false);
        setFieldInfo(initialFieldInfo);// Reset to initial values
        setFormValues({
            name: name || '',
        });
    }

    return (
        <>
            {/* <Button variant="contained" color="primary" onClick={() => { toggleEditMode(); handleOpenModal() }}>
                Update Card
            </Button> */}
            {isEditMode && (
                <Formik
                    initialValues={formValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <FormComponent
                            fieldInfo={fieldInfo}
                            isSubmitting={isSubmitting}
                            isOpen={isModalOpen}
                            onRequestClose={handleCloseModal}
                            cancelEdit={cancelEdit}
                            toggleEditable={toggleEditable}
                        />
                    )}
                </Formik>
            )}
            <Button variant="contained" color="primary" onClick={handleNewNote}>
                New Note
            </Button>
            <Link to={{
                pathname: `/courses/${courseId}/topics/${topicId}/notes/new`,
                state: { /* any data you want to pass to the new note component */ }
            }}>
                Create New Note
            </Link>
            {!isEditMode && (
                <>
                    <h1>Topic: {name}</h1>
                    {data.notes && data.notes.map(note => (
                        <div key={note.id}>
                            <h3>Note Name: {note.name}</h3>
                            <p>Note Content: {note.content}</p>
                            <p>Note Category: {note.category}</p>
                            <Button variant="contained" color="primary" onClick={() => handleEditNote(note.id)}>
                                Edit Note
                            </Button>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}

export default NoteCard