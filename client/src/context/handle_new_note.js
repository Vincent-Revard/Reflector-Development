import React, { useContext } from 'react';
import NewNote from './NewNote';
import { useParams } from 'react-router-dom';

import { Context } from './ContextProvider'; // Import the context

const HandleNewNote = () => {
    const { handlePostContextById } = useContext(Context); // Get the function from the context
    const { courseId, topicId } = useParams();


    const onSubmit = (data) => {
        handlePostContextById(courseId, topicId, data);
    };

    return (
        <NewNote onSubmit={onSubmit} handlePostContextById={handlePostContextById} />
    );
};

export default HandleNewNote;