import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
import { useParams } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';

const NewNote = () => {
    const { courseId, topicId, noteId } = useParams();
    const { handlePostContext, handlePatchContextById, data } = useProviderContext();

    const [initialValues, setInitialValues] = useState({
        name: '',
        title: '',
        category: '',
        content: '',
        reference: '',
    });

    useEffect(() => {
        if (noteId) {
            const course = data.courses?.find(course => course.id === courseId);
            const topic = course?.topics?.find(topic => topic.id === topicId);
            const note = topic?.notes?.find(note => note.id === noteId);
            if (note) {
                setInitialValues(note);
            }
        }
    }, [noteId, courseId, topicId, data]);

    const validationSchema = yup.object().shape({
        name: yup.string().required("Please enter a name"),
        title: yup.string().required("Please enter a title"),
        category: yup.string().required("Please enter a category"),
        content: yup.string().required("Please enter content"),
        reference: yup.string().required("Please enter a reference"), // new field
    });

    const onSubmit = (values, { setSubmitting }) => {
        if (noteId) {
            handlePatchContextById(courseId, values, topicId, noteId)
                .then(() => {
                    setSubmitting(false);
                });
        } else {
            handlePostContext(courseId, values, topicId)
                .then(() => {
                    setSubmitting(false);
                });
        }
    };

    const fieldInfo = [
        { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name', editable: true },
        { name: 'title', type: 'text', label: 'Title', placeholder: 'Enter title', editable: true },
        { name: 'category', type: 'text', label: 'Category', placeholder: 'Enter category', editable: true },
        { name: 'content', type: 'text', label: 'Content', placeholder: 'Enter content', editable: true },
        { name: 'reference', type: 'text', label: 'Reference', placeholder: 'Enter reference', editable: true },
    ];

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    {fieldInfo.map(field => (
                        <div key={field.name}>
                            <Field name={field.name} type={field.type} placeholder={field.placeholder} />
                            {errors[field.name] && touched[field.name] ? <div>{errors[field.name]}</div> : null}
                        </div>
                    ))}
                    <button type="submit" disabled={isSubmitting}>{noteId ? 'Update' : 'Submit'}</button>
                </Form>
            )}
        </Formik>
    );
};

export default NewNote;