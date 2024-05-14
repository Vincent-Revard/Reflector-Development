import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { useProviderContext } from './ContextProvider';

const SearchAndAddCourseOrTopic = ({ allNames, type, enrolledCourses, courseId, associatedTopics }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const { handleUnenroll, handleEnroll, showToast } = useProviderContext();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [filteredItems, setFilteredItems] = useState(allNames);

    useEffect(() => {
        setIsEnrolled(enrolledCourses?.some(course => course.id === selectedId));
    }, [selectedId, enrolledCourses]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setFilteredItems(allNames?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, allNames]);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleClickEnroll = (id) => (event) => {
        event.preventDefault();
        const topicId = type === 'topics' ? id : null;
        const courseIdForEnroll = type === 'topics' ? courseId : id;

        handleEnroll(courseIdForEnroll, topicId)
            .then(() => {
                showToast('success', `Successfully enrolled in ${type}`);
                setIsEnrolled(true);
                setFilteredItems(filteredItems.filter(item => item.id !== id));
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    const handleClickUnenroll = (id) => (event) => {
        event.preventDefault();
        const topicId = type === 'topics' ? id : null;
        const courseIdForUnenroll = type === 'topics' ? courseId : id;

        handleUnenroll(courseIdForUnenroll, topicId)
            .then(() => {
                showToast('success', `Successfully unenrolled from ${type}`);
                setIsEnrolled(false);
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
                        <Button variant="contained" color="primary" onClick={handleClickEnroll(item.id)} disabled={isEnrolled}>
                            Enroll
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClickUnenroll(item.id)} disabled={!isEnrolled}>
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