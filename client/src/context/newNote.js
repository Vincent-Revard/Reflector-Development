import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import FormComponent from '../components/form/form_component';
import { useParams } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';

const NewNote = () => {
    const { courseId, topicId } = useParams();
    const { handlePostContextById } = useProviderContext(); 

    const initialValues = {
        name: '',
        title: '',
        category: '',
        content: '',
    };

    const validationSchema = yup.object().shape({
        name: yup.string().required("Please enter a name"),
        title: yup.string().required("Please enter a title"),
        category: yup.string().required("Please enter a category"),
        content: yup.string().required("Please enter content"),
    });

    const onSubmit = (values) => {
        handlePostContextById(courseId, values, topicId); 
    };

    const fieldInfo = [
        { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', editable: true },
        { name: 'title', type: 'text', label: 'Title', placeholder: 'Enter title', editable: true },
        { name: 'category', type: 'text', label: 'Category', placeholder: 'Enter category', editable: true },
        { name: 'content', type: 'text', label: 'Content', placeholder: 'Enter content', editable: true },
    ];

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}        >
            {({ isSubmitting }) => (
                <FormComponent fieldInfo={fieldInfo} isSubmitting={isSubmitting} />
            )}
        </Formik>
    );
};

export default NewNote;