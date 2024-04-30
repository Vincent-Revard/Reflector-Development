import React, { useState } from 'react'
import * as yup from 'yup'
import FormComponent from '../components/form/form_component'
import { Formik } from 'formik'
import TopicCard from './topic_card'
import { styled } from '@mui/material'
import { Button, Card, CardContent, Typography, Modal } from '@mui/material'

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
})

const StyledButton = styled(Button)({
    margin: '10px',
})

const ContextCard = ({ data, handlePatchContext, handleDeleteContext, handlePostContext, showToast }) => {
    const { name, id } = data
    const [isEditMode, setIsEditMode] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [validationSchema, setValidationSchema] = useState(null)
    const initialFieldInfo = [
        { name: 'name', type: 'text', placeholder: 'Name', editable: true },
    ]
    const [fieldInfo, setFieldInfo] = useState(initialFieldInfo)
    const [expanded, setExpanded] = useState(false) 
    const [isSubmitting, setIsSubmitting] = useState(false) 


    const handleCardClick = () => {
        setExpanded(!expanded) 
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        cancelEdit()
    }

    const toggleEditable = (fieldName) => {
        setFieldInfo(fieldInfo.map(field =>
            field.name === fieldName
                ? { ...field, editable: !field.editable }
                : field
        ))
    }

    const toggleEditMode = () => {
        setIsEditMode(true)
        setFieldInfo([
            { name: 'name', type: 'text', placeholder: 'Name', label: `Update Name (current: ${name})`, editable: false },
        ])
        setValidationSchema(yup.object().shape({
            name: yup.string().required('Please enter a name'),
        }))
    }

    const handleError = (error) => {
        if (typeof error === 'string') {
            showToast(error)
        } else if (error && typeof error.message === 'string') {
            showToast(error.message)
        } else if (typeof error === 'object' && error !== null) {
            for (let field in error) {
                error[field].forEach((message) => {
                    showToast(`${field}: ${message}`)
                })
            }
        }
    }

    const [formValues, setFormValues] = useState({
        name: name || '',
    })

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        const payload = {
            id: id,
            name: values.name,
        }
        setIsSubmitting(setSubmitting)
        handlePatchContext(payload)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Update failed')
            }

            showToast('Card updated successfully')
            setIsEditMode(false)
            setFormValues({
                name: res.data.name,
            })
            resetForm({
                values: {
                    ...values,
                },
            })
        })
        .catch((error) => {
            handleError(error)
            setFormValues({
                name: name || '',
            })
        })
        .finally(() => {
            setSubmitting(false)
            setIsModalOpen(false)
        })

    return { isSubmitting: setSubmitting }
}

    const cancelEdit = () => {
        setIsEditMode(false)
        setFieldInfo(initialFieldInfo)
        setFormValues({
            name: name || '',
        })
    }

    const FormComponentWrapper = ({ isModalOpen, handleCloseModal, fieldInfo, isSubmitting, cancelEdit, toggleEditable }) => (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
            <FormComponent
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                fieldInfo={fieldInfo}
                isSubmitting={isSubmitting}
                cancelEdit={cancelEdit}
                toggleEditable={toggleEditable}
            />
        </Modal>
    )

    return (
        <>
            <StyledCard>
                <CardContent>
                    <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
                        {expanded ? 'Collapse Course' : 'Expand Course'}
                    </StyledButton>
                    <StyledButton variant="contained" color="secondary" onClick={() => { toggleEditMode(); handleOpenModal() }}>
                        Update Course Name
                    </StyledButton>
                        {isEditMode && (
                            <Formik
                                initialValues={formValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                                enableReinitialize
                            >
                                <FormComponentWrapper
                                    isModalOpen={isModalOpen}
                                    handleCloseModal={handleCloseModal}
                                    fieldInfo={fieldInfo}
                                    isSubmitting={isSubmitting}
                                    cancelEdit={cancelEdit}
                                    toggleEditable={toggleEditable}
                                />
                            </Formik>
                        )}
                    {!isEditMode && (
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {name}</Typography>
                    )}
                </CardContent>
            </StyledCard>
            {expanded && data.topics && data.topics.map((topic, index) =>
                <TopicCard key={index} data={topic} toggleEditMode={toggleEditMode} handleOpenModal={handleOpenModal}  />
            )}
        </>
    )
}



export default ContextCard