
import React, { useState } from 'react';
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { styled } from '@mui/material';
import TopicCard from './topic_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SearchAndAddCourseOrTopic from './search_or_add_course_and_topic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



// const StyledCard = styled(Card)({
//     margin: '20px 0',
//     padding: '20px',
//     backgroundColor: '#f5f5f5',
//     borderRadius: '15px',
// });

const StyledButton = styled(Button)({
    margin: '10px',
});

const CourseCard = ({ data, courseId }) => {
    const user = useAuth();


    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {data.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {user.id === data.creator_id && (
                        <Link to={`/courses/${courseId}/edit`}>
                            <StyledButton variant="contained" color="secondary">
                                Update Course Name
                            </StyledButton>
                        </Link>
                    )}
                    {data.topics && data.topics.map(topic =>
                        <TopicCard key={topic.id} data={topic} courseId={data.id} />
                    )}
                    <Link to={`/courses/${courseId}/topics/new`}>
                        <StyledButton variant="contained" color="primary">
                            Add Topic
                        </StyledButton>
                    </Link>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default CourseCard;