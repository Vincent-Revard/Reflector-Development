import React, {useState, useEffect} from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, Pagination, ButtonBase, Autocomplete, Modal } from '@mui/material';
import { useProviderContext } from './ContextProvider';
import { Link } from 'react-router-dom';


const ITEMS_PER_PAGE = 10;

// Custom hook to manage enrollment status
const useEnrollmentStatus = (isUnenrollPage, type, enrolledCourses, associatedTopics, allNames) => {
    const [enrollmentStatus, setEnrollmentStatus] = useState({});

    useEffect(() => {
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
    const [filteredItems, setFilteredItems] = useState(isUnenrollPage ? enrolledCourses : allNames);

    useEffect(() => {
        let items = isUnenrollPage ? (type === 'courses' ? enrolledCourses : associatedTopics) : allNames;
        setFilteredItems(items?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, isUnenrollPage, type, enrolledCourses, associatedTopics, allNames]);

    return [filteredItems, setFilteredItems];
};

const SearchAndAddCourseOrTopic = ({ allNames, type, enrolledCourses, courseId, associatedTopics, courseName }) => {
    const { handleUnenroll, handleEnroll, showToast, currentPage } = useProviderContext();
    const isUnenrollPage = currentPage.includes('unenroll');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [page, setPage] = useState(1);
    const [selectedName, setSelectedName] = useState(null);
    const [enrollingTopics, setEnrollingTopics] = useState([]);
    const [enrollmentStatus, setEnrollmentStatus] = useEnrollmentStatus(isUnenrollPage, type, enrolledCourses, associatedTopics, allNames);
    const [filteredItems, setFilteredItems] = useFilteredItems(isUnenrollPage, type, enrolledCourses, associatedTopics, allNames, searchTerm);
    const [openModal, setOpenModal] = useState(false);


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
        setOpenModal(true); // Open the modal when the button is clicked
    };

    const handleConfirm = (id) => {
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
                setSelectedId(null); // Clear the selection
                setSelectedName(null); // Clear the selection
                setOpenModal(false);
            })
            .catch(error => {
                showToast('error', `Error: ${error.message}`);
                setOpenModal(false);
            });
    };

    const handleCancel = () => {
        setOpenModal(false); 
    };

    let actionText;
    if (isUnenrollPage) {
        actionText = type === 'topics' ? `Remove a topic from ${courseName}` : `Unenroll from ${type}`;
    } else {
        actionText = type === 'topics' ? `Add a topic to ${courseName}` : `Enroll in new ${type}`;
    }

    const itemsOnPage = filteredItems?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: 720, bgcolor: 'background.paper' }}>
            <Box sx={{ width: '50%', pr: 2 }}>
                <Typography variant="h4" gutterBottom>
                    {actionText}
                </Typography>
                <Autocomplete
                    fullWidth
                    options={allNames?.map((option) => option.name)}
                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder={`Search for a ${type}`} />}
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                    }}
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
                {type === 'topics' && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Link to={`/course/${courseId}`}>
                            <Button variant="outlined">
                                Back to this course
                            </Button>
                        </Link>
                        <Link to="/course">
                            <Button variant="outlined">
                                Back to Courses
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
                {type === 'courses' && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Link to={`/course/${courseId}`}>
                            <Button variant="outlined">
                                Back to this course
                            </Button>
                        </Link>
                        <Link to="/course">
                            <Button variant="outlined">
                                Back to Courses
                            </Button>
                        </Link>
                    </Box>
                )}
                <List>
                    {itemsOnPage?.map(item => (
                        <ListItem key={item.id}>
                            <ButtonBase onClick={() => handleSelect(item.id, item.name)}>
                                <ListItemText primary={item.name} />
                            </ButtonBase>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ mt: 3 }}>
                    <Pagination count={Math.ceil((filteredItems?.length || 0) / ITEMS_PER_PAGE)} page={page} onChange={(event, value) => setPage(value)} />
                </Box>
            </Box>
            <Box sx={{ width: '50%', pl: 2 }}>
                {selectedId && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                            Selected {type} name: {selectedName}
                        </Typography>
                        {!isUnenrollPage && <Button variant="contained" color="primary" onClick={handleClick(selectedId)}>Enroll</Button>}
                        {isUnenrollPage && <Button variant="contained" color="secondary" onClick={handleClick(selectedId)}>Unenroll</Button>}
                    </Box>
                )}
            </Box>
            <Modal
                open={openModal}
                onClose={handleCancel}
            >
                <Box sx={{ width: 400, padding: 2, bgcolor: 'background.paper', margin: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        Are you sure you want to {isUnenrollPage ? 'unenroll from' : 'enroll in'} this {type}?
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => { handleConfirm(selectedId); setOpenModal(false); }}>Yes</Button>
                    <Button variant="outlined" color="secondary" onClick={() => { handleCancel(); setOpenModal(false); }}>No</Button>
                </Box>
            </Modal>
        </Box >
    );
}

export default SearchAndAddCourseOrTopic;