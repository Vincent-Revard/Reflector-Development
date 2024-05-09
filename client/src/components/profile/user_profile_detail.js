import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import FormComponent from '../form/form_component';
import { Formik } from 'formik'
import Modal from 'react-modal';

const UserProfileDetail = ({ data, handlePatchContext, handleDeleteContext, showToast }) => {
  const { username, email, id } = data;
  const [isEditMode, setIsEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationSchema, setValidationSchema] = useState(null);
  const initialFieldInfo = [
    { name: 'username', type: 'text', placeholder: 'Username', editable: true },
    { name: 'email', type: 'text', placeholder: 'Email', editable: true },
  ];
  const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    cancelEdit()
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  }

  const handleDelete = () => {
    handleDeleteContext();
    closeDeleteModal();
  }


  const toggleEditable = (fieldName) => {
    setFieldInfo(fieldInfo.map(field =>
      field.name === fieldName
        ? { ...field, editable: !field.editable }
        : field
    ))
  }
  const toggleEditMode = (isPasswordUpdate) => {
    setIsEditMode(true);
    setShowChangePassword(isPasswordUpdate);
    if (isPasswordUpdate) {
      setFieldInfo([
        { name: 'new_password', type: 'password', placeholder: 'New Password', autoComplete: 'new-password', label: 'New Password', editable: false },
        { name: 'current_password', type: 'password', placeholder: 'Current Password', autoComplete: 'current-password', label: 'Current Password', editable: true },
      ]);
      setValidationSchema(yup.object().shape({
        current_password: yup.string().required('Please enter your current password'),
        new_password: yup.string().required('Please enter a new password'),
      }));
    } else {
      setFieldInfo([
        { name: 'username', type: 'text', placeholder: 'Username', label: `Update Username (current: ${username})`, editable: false },
        { name: 'email', type: 'text', placeholder: 'Email', label: `Update Email Address (current: ${email})`, editable: false },
        { name: 'current_password', type: 'password', placeholder: 'Current Password', label: 'Current Password', editable: true },
      ]);
      setValidationSchema(yup.object().shape({
        username: yup.string().required('Please enter a username'),
        email: yup.string().email().required('Please enter an email'),
        current_password: yup.string().required('Please enter your current password'),
      }));
    }
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
    username: username || '',
    email: email || '',
    current_password: '',
    new_password: '',
  });
  useEffect(() => {
    setFieldInfo([
      { name: 'username', type: 'text', placeholder: 'Username', editable: false, label: `Update Username (current: ${formValues.username})` },
      { name: 'email', type: 'text', placeholder: 'Email', editable: false, label: `Update Email Address (current: ${formValues.email})` },
      { name: 'current_password', type: 'password', placeholder: 'Current Password', label: 'Current Password', editable: true },
    ]);
  }, [formValues]);

  const onSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    if (showChangePassword && !values.new_password) {
      showToast('error', 'Please enter a new password');
      return;
    }
    const payload = {
      username: values.username,
      email: values.email,
      current_password: values.current_password,
    };

    if (showChangePassword) {
      payload.password = values.new_password;
    }
    handlePatchContext(payload)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Update failed');
        }
        showToast('success', showChangePassword ? 'Password updated successfully' : 'Profile updated successfully');
        setIsEditMode(false);
        setShowChangePassword(false);
        setFormValues(prevState => ({
          username: showChangePassword ? prevState.username : res.data.username,
          email: showChangePassword ? prevState.email : res.data.email,
          current_password: '',
        }), () => {
          resetForm({
            values: {
              ...values,
              current_password: '',
              new_password: '',
            },
          });
        });
      })
      .catch((error) => {
        handleError(error);
        setFormValues({
          username: username || '',
          email: email || '',
          current_password: '',
          new_password: '',
        });
      })
      .finally(() => {
        setSubmitting(false);
        setIsModalOpen(false);
      });
  }

  const cancelEdit = () => {
    setIsEditMode(false);
    setShowChangePassword(false);
    setFieldInfo(initialFieldInfo);
    setFormValues({
      username: username || '',
      email: email || '',
      current_password: '',
      new_password: '',
    });
  }
  return (
    <>
      <button onClick={() => { toggleEditMode(false); handleOpenModal() }}>
        Update Profile
      </button>
      <button onClick={() => { toggleEditMode(true); handleOpenModal(); }}>
        Update Password
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
          <ul>
            <li>Username: {username}</li>
            <li>Email: {email}</li>
          </ul>
          <button onClick={openDeleteModal}>
            Delete Profile
          </button>
          <Modal
            isOpen={isDeleteModalOpen}
            onRequestClose={closeDeleteModal}
            contentLabel="Delete Profile Confirmation"
          // style={{
          //   overlay: {
          //     backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
          //   },
          //   content: {
          //     top: '50%',
          //     left: '50%',
          //     right: 'auto',
          //     bottom: 'auto',
          //     marginRight: '-50%',
          //     transform: 'translate(-50%, -50%)',
          //     width: '80%', // adjust width
          //     height: '80%', // adjust height
          //   },
          // }}
          >
            <h2>Are you sure you want to delete your profile?</h2>
            <button onClick={handleDelete}>Yes, delete my profile</button>
            <button onClick={closeDeleteModal}>No, keep my profile</button>
          </Modal>
        </>
      )}
    </>
  );
}

export default UserProfileDetail;