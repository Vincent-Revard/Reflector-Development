import { useParams } from 'react-router-dom';
import { useProviderContext } from './ContextProvider';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const EnrollUnenrollCourseOrTopic = ({ type }) => {
    const { id } = useParams();
    const { handlePostContext, handleDeleteContextById, showToast } = useProviderContext();

    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        // TODO: Check if the user is enrolled in the course or topic
        // setIsEnrolled(true or false based on the enrollment status)
    }, [id, type]);

    const handleEnroll = () => {
        handlePostContext(type, id)
            .then(() => {
                showToast('success', 'Successfully enrolled');
                setIsEnrolled(true);
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    const handleUnenroll = () => {
        handleDeleteContextById(id)
            .then(() => {
                showToast('success', 'Successfully unenrolled');
                setIsEnrolled(false);
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    return (
        <div>
            {isEnrolled ? (
                <Button variant="contained" color="secondary" onClick={handleUnenroll}>
                    Unenroll
                </Button>
            ) : (
                <Button variant="contained" color="primary" onClick={handleEnroll}>
                    Enroll
                </Button>
            )}
        </div>
    );
};

export default EnrollUnenrollCourseOrTopic;