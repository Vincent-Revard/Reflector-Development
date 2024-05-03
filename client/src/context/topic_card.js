import React, { useState } from 'react';
import NoteCard from './note_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { styled } from '@mui/material';
import { Button, Card, CardContent, Typography } from '@mui/material';

const StyledCard = styled(Card)({
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '15px',
});

const StyledButton = styled(Button)({
  margin: '10px',
});

const TopicCard = ({ data, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const { user } = useAuth();
    const handleCardClick = () => {
      setExpanded(!expanded);
    };
  return (
    <>
      <StyledCard>
        <CardContent>
          {user.id === data.creator_id && (
            <>
              <Link to={`/courses/${courseId}/topics/${data.id}/edit`}>
                <StyledButton variant="contained" color="primary">
                  Edit Topic
                </StyledButton>
              </Link>
              <Link to={`/courses/${courseId}/topics/new`}>
                <StyledButton variant="contained" color="primary">
                  New Topic
                </StyledButton>
              </Link>
              <Link to={`/courses/${courseId}/topics/${data.id}/notes/new`}>
                <StyledButton variant="contained" color="primary">
                  New Note
                </StyledButton>
              </Link>
            </>
          )}
          <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
            {expanded ? 'Collapse Topic' : 'Expand Topic'}
          </StyledButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'blue' }}>Topic: {data.name}</Typography>
        </CardContent>
      </StyledCard>
      {
        expanded && data.notes && data.notes.map(note =>
          <Link key={note.id} to={`/courses/${courseId}/topics/${data.id}/notes/${note.id}`}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Note: {note.name}</Typography>
          </Link>
        )
      }
    </>
  );
};


export default TopicCard;


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// import React, { useState, useEffect } from 'react';
// import * as yup from 'yup';
// import { Formik } from 'formik'
// // import { useNavigate } from 'react-router-dom';
// // import Button from '@mui/material/Button';
// // import TextField from '@mui/material/TextField';
// // import Modal from '@mui/material/Modal';
// // import FormComponent from '../components/form/form_component';
// // import NoteCard from './note_card';


// import { useNavigate } from 'react-router-dom';
// import EditableCard from './editable_card';
// import Button from '@mui/material/Button';
// import NoteCard from './note_card';
// import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useToast } from './ToastContext';


// const TopicCard = ({ topic, courseId, user }) => {
//   const navigate = useNavigate();
//   const { name, creator_id, id } = topic;
//   const [isNoteCardVisible, setIsNoteCardVisible] = useState(false);
//   const location = useLocation();
//   const endpointID = location.state.data;
//   const { showToast } = useToast();

//   return (
//     <EditableCard
//       data={topic}
//       render={({ isEditMode, toggleEditMode, handleOpenModal, handleCloseModal, fieldInfo, formValues }) => (
//         <>
//           {user.id === creator_id && (
//             <>
//               <Link to={{
//                 pathname: `/topics/${id}/edit`,
//                 state: { creatorId: creator_id, name: name, topicId: id, endpointID: endpointID, courseId: courseId, user: user }
//               }}>
//                 <Button variant="contained" color="primary">
//                   Edit Topic
//                 </Button>
//               </Link>
//               <Link to={{
//                 pathname: "/topics/new",
//                 state: { courseId: courseId }
//               }}>
//                 <Button variant="contained" color="primary">
//                   New Topic
//                 </Button>
//               </Link>
//             </>
//           )}
//           <Button variant="contained" color="primary" onClick={() => setIsNoteCardVisible(!isNoteCardVisible)}>
//             {isNoteCardVisible ? 'Hide Notes' : 'Show Notes'}
//           </Button>
//           {isNoteCardVisible && <NoteCard data={topic} />}
//         </>
//       )}
//     />
//   );
// }

// export default TopicCard;


















// const TopicCard = ({ data, handlePatchContext, handleDeleteContext, showToast, user }) => {
//   const { name, id, creator_id } = data;
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [validationSchema, setValidationSchema] = useState(null);
//   const [isNoteCardVisible, setIsNoteCardVisible] = useState(false);
//   const initialFieldInfo = [
//     { name: 'name', type: 'text', placeholder: 'Name', editable: true },
//   ];
//   console.log(`user: ${user} and  creator_id: ${creator_id}and ${id}`)
//   const [fieldInfo, setFieldInfo] = useState(initialFieldInfo);
//   const [editingTopicId, setEditingTopicId] = useState(null); 

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     cancelEdit()
//   };

//   const toggleEditable = (fieldName) => {
//     setFieldInfo(fieldInfo.map(field =>
//       field.name === fieldName
//         ? { ...field, editable: !field.editable }
//         : field
//     ))
//   }

//   const toggleEditMode = (topicId) => {
//     setIsEditMode(true);
//     setEditingTopicId(topicId); 
//     setFieldInfo([
//       { name: 'name', type: 'text', placeholder: 'Name', label: `Update Name (current: ${name})`, editable: false },
//     ]);
//     setValidationSchema(yup.object().shape({
//       name: yup.string().required('Please enter a name'),
//     }));
//   }

//   const handleError = (error) => {
//     if (typeof error === 'string') {
//       showToast('error', error);
//     } else if (error && typeof error.message === 'string') {
//       showToast('error', error.message);
//     } else if (typeof error === 'object' && error !== null) {
//       for (let field in error) {
//         error[field].forEach((message) => {
//           showToast('error', `${field}: ${message}`);
//         });
//       }
//     }
//   }

//   const [formValues, setFormValues] = useState({
//     name: name || '',
//   });

//   const onSubmit = (values, { setSubmitting, resetForm }) => {
//     const payload = {
//       id: editingTopicId,
//       name: values.name,
//     };

//     handlePatchContext(payload)
//       .then((res) => {
//         if (!res.ok) {
//           showToast('error', 'Update failed');
//         }

//         showToast('success', 'Card updated successfully');
//         setIsEditMode(false);
//         setFormValues({
//           name: res.data.name,
//         });
//         resetForm({
//           values: {
//             ...values,
//           },
//         });
//       })
//       .catch((error) => {
//         handleError(error);
//         setFormValues({
//           name: name || '',
//         });
//       })
//       .finally(() => {
//         setSubmitting(false);
//         setIsModalOpen(false);
//       });
//   }

//   const cancelEdit = () => {
//     setIsEditMode(false);
//     setFieldInfo(initialFieldInfo);// Reset to initial values
//     setFormValues({
//       name: name || '',
//     });
//   }
//   return (
//     <>
//       {user.id === creator_id && (
//         <Button variant="contained" color="primary" onClick={() => { toggleEditMode(id); handleOpenModal() }}>
//           Update Topic Name
//         </Button>
//       )}
//       <Button variant="contained" color="primary" onClick={() => setIsNoteCardVisible(!isNoteCardVisible)}>
//         {isNoteCardVisible ? 'Hide Notes' : 'Show Notes'}
//       </Button>
//       {isNoteCardVisible && <NoteCard data={data} handlePatchContext={handlePatchContext} showToast={showToast} />}
//       {isEditMode && (
//         <Formik
//           initialValues={formValues}
//           validationSchema={validationSchema}
//           onSubmit={onSubmit}
//           enableReinitialize
//         >
//           {({ isSubmitting }) => (
//             <FormComponent
//               fieldInfo={fieldInfo}
//               isSubmitting={isSubmitting}
//               isOpen={isModalOpen}
//               onRequestClose={handleCloseModal}
//               cancelEdit={cancelEdit}
//               toggleEditable={toggleEditable}
//             />
//           )}
//         </Formik>
//       )}
//       {!isEditMode && (
//         <>
//           <p>Topic: {name}</p>
//         </>
//       )}
//     </>
//   );
// }


// export default TopicCard;