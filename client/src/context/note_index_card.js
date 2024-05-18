import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NoteIndexCard = ({ note, courseId, topicId }) => {
    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5"> Note: {note.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1"> Content: {note.content}</Typography>
                    <Link to={`/course/${courseId}/topic/${topicId}/note/${note.id}`}>
                        <Button variant="contained" color="primary">View More</Button>
                    </Link>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default NoteIndexCard;