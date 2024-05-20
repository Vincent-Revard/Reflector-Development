import React from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Pagination } from '@mui/material';
import { useProviderContext } from './ContextProvider';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

// Custom hook to manage enrollment status
const useEnrollmentStatus = (isUnenrollPage, type, enrolledCourses, associatedTopics, allNames) => {
    const [enrollmentStatus, setEnrollmentStatus] = React.useState({});

    React.useEffect(() => {
        let items = isUnenrollPage ? (type === 'courses' ? enrolledCourses : associatedTopics) : allNames;
        items?.forEach(item => {
            const isEnrolled = enrolledCourses?.some(course => course.id === item.id);
            const isAssociated = associatedTopics?.some(topic => topic.id === item.id);
            setEnrollmentStatus(prevState => ({ ...prevState, [item.id]: isUnenrollPage ? true : (isEnrolled || isAssociated) }));
        });
    }, [isUnenrollPage, type, enrolledCourses, associatedTopics, allNames]);

    return [enrollmentStatus, setEnrollmentStatus];
};

// Custom hook to manage filtered items
const useFilteredItems = (isUnenrollPage, type, enrolledCourses, associatedTopics, allNames, searchTerm) => {
    const [filteredItems, setFilteredItems] = React.useState(isUnenrollPage ? enrolledCourses : allNames);

    React.useEffect(() => {
        let items = isUnenrollPage ? (type === 'courses' ? enrolledCourses : associatedTopics) : allNames;
        setFilteredItems(items?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, isUnenrollPage, type, enrolledCourses, associatedTopics, allNames]);

    return [filteredItems, setFilteredItems];
};

const SearchAndAddCourseOrTopic = ({ allNames, type, enrolledCourses, courseId, associatedTopics, courseName }) => {
    const { handleUnenroll, handleEnroll, showToast, currentPage } = useProviderContext();
    const isUnenrollPage = currentPage.includes('unenroll');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedId, setSelectedId] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [selectedName, setSelectedName] = React.useState(null);
    const [enrollingTopics, setEnrollingTopics] = React.useState([]);
    const [enrollmentStatus, setEnrollmentStatus] = useEnrollmentStatus(isUnenrollPage, type, enrolledCourses, associatedTopics, allNames);
    const [filteredItems, setFilteredItems] = useFilteredItems(isUnenrollPage, type, enrolledCourses, associatedTopics, allNames, searchTerm);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSelect = (id, name) => {
        setSelectedId(id);
        setSelectedName(name);
        const isEnrolled = enrolledCourses?.some(course => course.id === id);
        const isAssociated = associatedTopics?.some(topic => topic.id === id);
        if (isUnenrollPage) {
            setEnrollmentStatus(prevState => ({ ...prevState, [id]: isEnrolled || isAssociated }));
            if (type === 'topics') {
                setEnrollingTopics(prevTopics => prevTopics.filter(topicId => topicId !== id));
            }
        } else {
            setEnrollmentStatus(prevState => ({ ...prevState, [id]: !(isEnrolled || isAssociated) }));
            if (type === 'topics') {
                setEnrollingTopics(prevTopics => [...prevTopics, id]);
            }
        }
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
        actionText = type === 'topics' ? `Remove a topic from ${courseName}` : `Unenroll from ${type}`;
    } else {
        actionText = type === 'topics' ? `Add a topic to ${courseName}` : `Enroll in new ${type}`;
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
            {type === 'topics' && courseId && !isUnenrollPage && (
                <Box sx={{ mt: 3 }}>
                    <Link to={`/course/${courseId}/topic/new`}>
                        <Button variant="contained" color="primary">
                            Create New Topic
                        </Button>
                    </Link>
                </Box>
            )}
            {type === 'courses' && !isUnenrollPage && (
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
                    <ListItem key={item.id} component="button" onClick={() => handleSelect(item.id, item.name)}>
                        <ListItemText primary={item.name} sx={{ flexGrow: 1 }} />
                        <ListItemSecondaryAction sx={{ flexShrink: 1 }}>
                            {!isUnenrollPage && <Button variant="contained" color="primary" onClick={handleClick(item.id)}>Enroll</Button>}
                            {isUnenrollPage && <Button variant="contained" color="secondary" onClick={handleClick(item.id)}>Unenroll</Button>}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {selectedId && (
                <Typography variant="h6">
                    Selected {type} name: {selectedName}
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