import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { useProviderContext } from './ContextProvider';

const SearchAndAddCourseOrTopic = ({ allNames, type, enrolledCourses, courseId, associatedTopics }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const { handleUnenroll, handleEnroll, showToast } = useProviderContext();
    const [isAssociated, setIsAssociated] = useState(false);
    const [filteredItems, setFilteredItems] = useState(allNames);
    const [enrollmentStatus, setEnrollmentStatus] = useState({});


    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setFilteredItems(allNames?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, allNames]);

    const handleSelect = (id) => {
        setSelectedId(id);
        const isEnrolled = enrolledCourses?.some(course => course.id === id);
        const isAssociated = associatedTopics?.some(topic => topic.id === id);
        setEnrollmentStatus(prevState => ({ ...prevState, [id]: isEnrolled || isAssociated }));
    };

    // Update state when enrolling
    const handleClickEnroll = (id) => (event) => {
        event.preventDefault();
        let topicId = null;
        let courseIdForEnroll = parseInt(id, 10);
        
        if (type === 'topics') {
            topicId = id;
            courseIdForEnroll = courseId;
        }

        handleEnroll(courseIdForEnroll, topicId, type)
            .then(() => {
                showToast('success', `Successfully enrolled in ${type}`);
                setEnrollmentStatus(prevState => ({ ...prevState, [id]: true }));
                setFilteredItems(filteredItems.filter(item => item.id !== id));
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    // Update state when unenrolling
    const handleClickUnenroll = (id) => (event) => {
        event.preventDefault();
        let topicId = null;
        let courseIdForUnenroll = id;

        if (type === 'topics') {
            topicId = id;
            courseIdForUnenroll = courseId;
        }

        handleUnenroll(courseIdForUnenroll, topicId, type)
            .then(() => {
                showToast('success', `Successfully unenrolled from ${type}`);
                setEnrollmentStatus(prevState => ({ ...prevState, [id]: false }));
                setFilteredItems(filteredItems.filter(item => item.id !== id));
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search for a ${type} to add`}
                value={searchTerm}
                onChange={handleChange}
            />
            <List>
                {filteredItems?.map(item => (
                    <ListItem key={item.id} component="button" onClick={() => handleSelect(item.id)}>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                            <Button variant="contained" color="primary" onClick={handleClickEnroll(item.id)} disabled={enrollmentStatus[item.id] || isAssociated}>
                                Enroll
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleClickUnenroll(item.id)} disabled={!enrollmentStatus[item.id] && !isAssociated}>
                                Unenroll
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {selectedId && (
                <Typography variant="h6">
                    Selected {type} ID: {selectedId}
                </Typography>
            )}
        </Box>
    );
};

export default SearchAndAddCourseOrTopic;