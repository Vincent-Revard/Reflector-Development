
import { Field, Form, ErrorMessage } from 'formik'
import Modal from 'react-modal'

const FormComponent = ({ fieldInfo, isSubmitting ,isOpen, onRequestClose, cancelEdit, toggleEditable }) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                content: {
                    zIndex: 2000,
                },
            }}
        >
            <Form className='form-wrapper'>
                <section>
                    {fieldInfo.map((field) => (
                        <div key={field.name} className='formik'>
                            {field.type === 'checkbox' ? (
                                <Field type={field.type} id={field.name} name={field.name} disabled={!field.editable} />
                            ) : (
                                <Field type={field.type} id={field.name} name={field.name} placeholder={field.placeholder} disabled={!field.editable} />
                            )}
                            <label htmlFor={field.name} id={field.name}>{field.label}</label>
                            {!field.editable && <button type='button' onClick={() => toggleEditable(field.name)}>Toggle Edit</button>}
                            <ErrorMessage name={field.name} component='div' className='form-alerts' />
                        </div>
                    ))}
                    <button type='submit' disabled={isSubmitting} className={isSubmitting ? 'disabled' : 'form-btn'}>Submit</button>
                    <button type='button' onClick={cancelEdit} disabled={isSubmitting}>Cancel Edit</button>
                </section>
            </Form>
        </Modal>
    )
}

export default FormComponent