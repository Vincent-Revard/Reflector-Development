import React, { useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormComponent from '../components/form/form_component';
import NoteCard from './note_card';

const TopicCard = ({ data, handlePatchContext, handleDeleteContext, showToast, user }) => {
  const { name, id, creator_id } = data;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationSchema, setValidationSchema] = useState(null);
  const [isNoteCardVisible, setIsNoteCardVisible] = useState(false);
  const initialFieldInfo = [
    { name: 'name', type: 'text', placeholder: 'Name', editable: true },
  ];
  console.log(`user: ${user} and  creator_id: ${creator_id}and ${id}`)
  const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);
  const [editingTopicId, setEditingTopicId] = useState(null); 

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

  const toggleEditMode = (topicId) => {
    setIsEditMode(true);
    setEditingTopicId(topicId); 
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
      id: editingTopicId,
      name: values.name,
    };

    handlePatchContext(payload)
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
      {user.id === creator_id && (
        <Button variant="contained" color="primary" onClick={() => { toggleEditMode(id); handleOpenModal() }}>
          Update Topic Name
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={() => setIsNoteCardVisible(!isNoteCardVisible)}>
        {isNoteCardVisible ? 'Hide Notes' : 'Show Notes'}
      </Button>
      {isNoteCardVisible && <NoteCard data={data} handlePatchContext={handlePatchContext} showToast={showToast} />}
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
      {!isEditMode && (
        <>
          <p>Topic: {name}</p>
        </>
      )}
    </>
  );
}


export default TopicCard;