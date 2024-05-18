import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction , Pagination} from '@mui/material';
import { useProviderContext } from './ContextProvider';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const SearchAndAddCourseOrTopic = ({ allNames, type, enrolledCourses, courseId, associatedTopics }) => {
    const { handleUnenroll, handleEnroll, showToast, currentPage } = useProviderContext();
    const isUnenrollPage = currentPage.includes('unenroll');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [filteredItems, setFilteredItems] = useState(isUnenrollPage ? enrolledCourses : allNames);    const [enrollmentStatus, setEnrollmentStatus] = useState({});
    const [page, setPage] = useState(1); 



    useEffect(() => {
        const items = isUnenrollPage ? enrolledCourses : allNames;        setFilteredItems(items?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, allNames, enrolledCourses, isUnenrollPage, associatedTopics]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSelect = (id) => {
        setSelectedId(id);
        const isEnrolled = enrolledCourses?.some(course => course.id === id);
        const isAssociated = associatedTopics?.some(topic => topic.id === id);
        setEnrollmentStatus(prevState => ({ ...prevState, [id]: isEnrolled || isAssociated }));
    };

    const handleClick = (id) => (event) => {
        event.preventDefault();
        let topicId = null;
        let courseIdForAction = parseInt(id, 10);

        if (type === 'topics') {
            topicId = id;
            courseIdForAction = courseId;
        }

        const action = isUnenrollPage ? handleUnenroll : handleEnroll;
        const actionMessage = isUnenrollPage ? 'unenrolled' : 'enrolled';

        action(courseIdForAction, topicId, type)
            .then(() => {
                showToast('success', `Successfully ${actionMessage} in ${type}`);
                setEnrollmentStatus(prevState => ({ ...prevState, [id]: !isUnenrollPage }));
                setFilteredItems(filteredItems.filter(item => item.id !== id));
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
            });
    };

    let actionText;
    if (isUnenrollPage) {
        actionText = type === 'topics' ? 'Remove a topic from a course' : `Unenroll from ${type}`;
    } else {
        actionText = type === 'topics' ? 'Add a topic to a course' : `Enroll in new ${type}`;
    }

    const itemsOnPage = filteredItems?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);



    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Typography variant="h4" gutterBottom>
                {actionText}
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search for a ${type}`}
                value={searchTerm}
                onChange={handleChange}
            />
            {type === 'topics' && courseId && (
                <Box sx={{ mt: 3 }}>
                    <Link to={`/course/${courseId}/topic/new`}>
                        <Button variant="contained" color="primary">
                            Create New Topic
                        </Button>
                    </Link>
                </Box>
            )}
            {type === 'courses' && (
                <Box sx={{ mt: 3 }}>
                    <Link to="/course/new">
                        <Button variant="contained" color="primary">
                            Create New Course
                        </Button>
                    </Link>
                </Box>
            )}
            <List>
                {itemsOnPage?.map(item => (
                    <ListItem key={item.id} component="button" onClick={() => handleSelect(item.id)}>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                            <Button variant="contained" color={isUnenrollPage ? "secondary" : "primary"} onClick={handleClick(item.id)} disabled={enrollmentStatus[item.id] === isUnenrollPage}>
                                {isUnenrollPage ? "Unenroll" : "Enroll"}
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
            <Box sx={{ mt: 3 }}>
                <Link to="/course">
                    <Button variant="outlined">
                        Back to Courses
                    </Button>
                </Link>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Pagination count={Math.ceil((filteredItems?.length || 0) / ITEMS_PER_PAGE)} page={page} onChange={(event, value) => setPage(value)} />
            </Box>
        </Box>
    );
};
export default SearchAndAddCourseOrTopic;