
import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material';
import TopicCard from './topic_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
});

const StyledButton = styled(Button)({
    margin: '10px',
});

const CourseCard = ({ data, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const user = useAuth();

    const handleCardClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <StyledCard>
                <CardContent>
                    <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
                        {expanded ? 'Collapse Course' : 'Expand Course'}
                    </StyledButton>
                    {user.id === data.creator_id && (
                        <Link to={`/courses/${courseId}/edit`}>
                            <StyledButton variant="contained" color="secondary">
                                Update Course Name
                            </StyledButton>
                        </Link>
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'blue' }}>Course: {data.name}</Typography>
                </CardContent>
            </StyledCard>
            {
                expanded && data.topics && data.topics.map(topic =>
                    <TopicCard key={topic.id} data={topic} courseId={data.id} />
                )
            }
        </>
    );
};

export default CourseCard;
