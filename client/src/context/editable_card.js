// EditableCard.js
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Modal } from '@mui/material';
import { useProviderContext } from './ContextProvider';
import { useToast } from './ToastContext';

const EditableCard = ({ data, render }) => {
    const { handlePatchContextById } = useProviderContext();
    const { name, endpointID, creator_id, topicId, courseId, user, noteId } = data;
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();
    const [validationSchema, setValidationSchema] = useState(null);
    const initialFieldInfo = [
        { name: 'name', type: 'text', placeholder: 'Name', editable: true },
    ];
    const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);
    const [formValues, setFormValues] = useState({
        name: name || '',
    });
    console.log(`userID: ${user} ,  creator_id: ${creator_id}, endpointId: ${endpointID},  name: ${name}, functionHandlePatch: ${handlePatchContextById} , topicId: ${topicId}, courseId: ${courseId}`)

    const toggleEditMode = () => {
        setIsEditMode(true);
        setFieldInfo([
            { name: 'name', type: 'text', placeholder: 'Name', label: `Update Name (current: ${name})`, editable: false },
        ]);
        setValidationSchema(yup.object().shape({
            name: yup.string().required('Please enter a name'),
        }));
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        cancelEdit();
    };

    const cancelEdit = () => {
        setIsEditMode(false);
        setFieldInfo(initialFieldInfo);
        setFormValues({
            name: name || '',
        });
    };

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        if (!values.name) {
            showToast('error', 'Please enter a name');
            return;
        }
        const updates = {
            id: endpointID,
            name: values.name,
        };
        handlePatchContextById(endpointID, updates, topicId, courseId, noteId)
            .then((res) => {
                if (!res.ok) {
                    showToast('error', 'Update failed');
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
                showToast('error', 'Update failed:'`${error.message}`)
                setFormValues({
                    name: name || '',
                });
            })
            .finally(() => {
                setSubmitting(false);
                setIsModalOpen(false);
            });
    };

    return (
        <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {render({ isEditMode, toggleEditMode, handleOpenModal, handleCloseModal, fieldInfo, formValues })}
        </Formik>
    );
};

export default EditableCard;