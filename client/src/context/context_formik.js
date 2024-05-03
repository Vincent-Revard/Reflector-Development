import React from 'react';
import { Formik } from 'formik';
import * as yup from "yup";
import FormComponent from '../components/form/form_component';
import { useParams } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';

const ContextFormik = ({ initialValues, validationSchema, fieldInfo, onSubmit }) => {
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

export default ContextFormik;