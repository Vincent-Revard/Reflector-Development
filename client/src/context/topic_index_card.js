import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TopicIndexCard = ({ topic, courseId }) => {
    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5"> Topic: {topic.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Link to={`/course/${courseId}/topic/${topic.id}/note`}>
                        <Button variant="contained" color="primary">View Notes</Button>
                    </Link>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default TopicIndexCard;