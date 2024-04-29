import React, { useState } from 'react';
import * as yup from 'yup';
import FormComponent from '../components/form/form_component';
import { Formik } from 'formik'
import TopicCard from './topic_card';

const ContextCard = ({ data, handlePatchContext, showToast }) => {
    const { name, id } = data;
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationSchema, setValidationSchema] = useState(null);
    const initialFieldInfo = [
        { name: 'name', type: 'text', placeholder: 'Name', editable: true },
    ];
    const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);
    const [expanded, setExpanded] = useState(false); // New state for tracking whether the card is expanded

    const handleCardClick = () => {
        setExpanded(!expanded); // Toggle the expanded state when the card is clicked
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
            showToast(error);
        } else if (error && typeof error.message === 'string') {
            showToast(error.message);
        } else if (typeof error === 'object' && error !== null) {
            for (let field in error) {
                error[field].forEach((message) => {
                    showToast(`${field}: ${message}`);
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
        
                showToast('Card updated successfully');
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
            <div onClick={handleCardClick}>
                <button onClick={() => { toggleEditMode(); handleOpenModal() }}>
                    Update Card
                </button>
                {isEditMode && (
                    <Formik
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <FormComponent
                                isOpen={isModalOpen}
                                onRequestClose={handleCloseModal}
                                fieldInfo={fieldInfo}
                                isSubmitting={isSubmitting}
                                cancelEdit={cancelEdit}
                                toggleEditable={toggleEditable}
                            />
                        )}
                    </Formik>
                )}
                {!isEditMode && (
                    <>
                        <p>Name: {name}</p>
                    </>
                )}
            </div>
            {expanded && data.course_topics.map(topic =>
                <TopicCard key={topic.id} data={topic} />
            )}
        </>
    );
}
    

export default ContextCard;