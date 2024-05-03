
import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material';
import TopicCard from './topic_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
});

const StyledButton = styled(Button)({
    margin: '10px',
});

const CourseCard = ({ data, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const user = useAuth();

    const handleCardClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <StyledCard>
                <CardContent>
                    <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
                        {expanded ? 'Collapse Course' : 'Expand Course'}
                    </StyledButton>
                    {user.id === data.creator_id && (
                        <Link to={`/courses/${courseId}/edit`}>
                            <StyledButton variant="contained" color="secondary">
                                Update Course Name
                            </StyledButton>
                        </Link>
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {data.name}</Typography>
                </CardContent>
            </StyledCard>
            {
                expanded && data.topics && data.topics.map(topic =>
                    <TopicCard key={topic.id} data={topic} courseId={data.id} />
                )
            }
        </>
    );
};

export default CourseCard;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// // ContextCard.js
// import React, { useState} from 'react';
// import { Button, Card, CardContent, Typography } from '@mui/material';
// import { styled } from '@mui/material';
// import TopicCard from './topic_card';
// import EditableCard from './editable_card';
// import { Link } from 'react-router-dom';

// const StyledCard = styled(Card)({
//     margin: '20px 0',
//     padding: '20px',
//     backgroundColor: '#f5f5f5',
//     borderRadius: '15px',
// });

// const StyledButton = styled(Button)({
//     margin: '10px',
// });

// const CourseCard = ({ data , courseId, user}) => {
//     const [expanded, setExpanded] = useState(false);

//     const handleCardClick = (id) => {
//         debugger
//         setExpanded(!expanded);
//     };

//     return (
//         <EditableCard data={data} render={({ isEditMode, toggleEditMode, handleOpenModal, handleCloseModal, fieldInfo, formValues }) => (
//             <>
//                 <StyledCard>
//                     <CardContent>
//                         <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
//                             {expanded ? 'Collapse Course' : 'Expand Course'}
//                         </StyledButton>
//                         {user.id === data.creator_id && (
//                             <StyledButton variant="contained" color="secondary" onClick={() => { toggleEditMode(); handleOpenModal(); }}>
//                                 Update Course Name
//                             </StyledButton>
//                         )}
//                         {!isEditMode && (
//                             <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {data.name}</Typography>
//                         )}
//                     </CardContent>
//                 </StyledCard>
//                 {expanded && data.topics && data.topics?.map(topic =>
//                     <TopicCard key={topic.id} data={topic} toggleEditMode={toggleEditMode} courseId={data.id} handleOpenModal={handleOpenModal} />
//                 )}
//             </>
//         )} />
//     );
// };

// export default CourseCard;


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// import React, { useState } from 'react'
// import * as yup from 'yup'
// import FormComponent from '../components/form/form_component'
// import { Formik } from 'formik'
// import TopicCard from './topic_card'
// import { styled } from '@mui/material'
// import { Button, Card, CardContent, Typography, Modal } from '@mui/material'

// const StyledCard = styled(Card)({
//     margin: '20px 0',
//     padding: '20px',
//     backgroundColor: '#f5f5f5',
//     borderRadius: '15px',
// })

// const StyledButton = styled(Button)({
//     margin: '10px',
// })

// const ContextCard = ({ data, handlePatchContext, handleDeleteContext, handlePostContext, showToast, topicId, user, courseId }) => {
//     const { name, id, creator_id } = data
//     const [isEditMode, setIsEditMode] = useState(false)
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [validationSchema, setValidationSchema] = useState(null)
//     const initialFieldInfo = [
//         { name: 'name', type: 'text', placeholder: 'Name', editable: true },
//     ]
//     console.log(`user: ${user} and  creator_id: ${creator_id}and ${id}`)
//     const [fieldInfo, setFieldInfo] = useState(initialFieldInfo)
//     const [expanded, setExpanded] = useState(false) 
//     const [isSubmitting, setIsSubmitting] = useState(false) 


//     const handleCardClick = () => {
//         setExpanded(!expanded) 
//     }

//     const handleOpenModal = () => {
//         setIsModalOpen(true)
//     }

//     const handleCloseModal = () => {
//         setIsModalOpen(false)
//         cancelEdit()
//     }

//     const toggleEditable = (fieldName) => {
//         setFieldInfo(fieldInfo.map(field =>
//             field.name === fieldName
//                 ? { ...field, editable: !field.editable }
//                 : field
//         ))
//     }

//     const toggleEditMode = () => {
//         setIsEditMode(true)
//         setFieldInfo([
//             { name: 'name', type: 'text', placeholder: 'Name', label: `Update Name (current: ${name})`, editable: false },
//         ])
//         setValidationSchema(yup.object().shape({
//             name: yup.string().required('Please enter a name'),
//         }))
//     }

//     const handleError = (error) => {
//         if (typeof error === 'string') {
//             showToast('error', error)
//         } else if (error && typeof error.message === 'string') {
//             showToast('error', error.message)
//         } else if (typeof error === 'object' && error !== null) {
//             for (let field in error) {
//                 error[field].forEach((message) => {
//                     showToast('error', `${field}: ${message}`)
//                 })
//             }
//         }
//     }

//     const [formValues, setFormValues] = useState({
//         name: name || '',
//     })

//     const onSubmit = (values, { setSubmitting, resetForm }) => {
//         const payload = {
//             id: id,
//             name: values.name,
//         }
//         setIsSubmitting(setSubmitting)
//         handlePatchContext(payload)
//         .then((res) => {
//             if (!res.ok) {
//                 showToast('error', 'Update failed')
//             }

//             showToast('success', 'Card updated successfully')
//             setIsEditMode(false)
//             setFormValues({
//                 name: res.data.name,
//             })
//             resetForm({
//                 values: {
//                     ...values,
//                 },
//             })
//         })
//         .catch((error) => {
//             handleError(error)
//             setFormValues({
//                 name: name || '',
//             })
//         })
//         .finally(() => {
//             setSubmitting(false)
//             setIsModalOpen(false)
//         })

//     return { isSubmitting: setSubmitting }
// }

//     const cancelEdit = () => {
//         setIsEditMode(false)
//         setFieldInfo(initialFieldInfo)
//         setFormValues({
//             name: name || '',
//         })
//     }

//     const FormComponentWrapper = ({ isModalOpen, handleCloseModal, fieldInfo, isSubmitting, cancelEdit, toggleEditable }) => (
//         <Modal open={isModalOpen} onClose={handleCloseModal}>
//             <FormComponent
//                 isOpen={isModalOpen}
//                 onRequestClose={handleCloseModal}
//                 fieldInfo={fieldInfo}
//                 isSubmitting={isSubmitting}
//                 cancelEdit={cancelEdit}
//                 toggleEditable={toggleEditable}
//             />
//         </Modal>
//     )

//     return (
//     <>
//         <StyledCard>
//             <CardContent>
//                 <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
//                     {expanded ? 'Collapse Course' : 'Expand Course'}
//                 </StyledButton>
//                     {user.id === creator_id && (
//                         <StyledButton variant="contained" color="secondary" onClick={() => { toggleEditMode(); handleOpenModal() }}>
//                             Update Course Name
//                         </StyledButton>
//                     )}
//                     <Formik
//                         initialValues={formValues}
//                         validationSchema={validationSchema}
//                         onSubmit={onSubmit}
//                         enableReinitialize
//                     >
//                         <FormComponentWrapper
//                             isModalOpen={isModalOpen}
//                             handleCloseModal={handleCloseModal}
//                             fieldInfo={fieldInfo}
//                             isSubmitting={isSubmitting}
//                             cancelEdit={cancelEdit}
//                             toggleEditable={toggleEditable}
//                         />
//                     </Formik>
//                 {!isEditMode && (
//                     <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {name}</Typography>
//                 )}
//             </CardContent>
//         </StyledCard>
//             {expanded && data.topics && data.topics.map((topic, index) =>
//                 <TopicCard key={topic.id} data={topic} toggleEditMode={toggleEditMode} handleOpenModal={handleOpenModal} />
//             )}
//     </>
//     )
// }



// export default ContextCard