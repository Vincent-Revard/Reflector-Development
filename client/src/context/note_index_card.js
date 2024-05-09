import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NoteIndexCard = ({ note, courseId, topicId }) => {
    const [expanded, setExpanded] = useState(false);

    const handleNoteClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleNoteClick}>
                <Typography variant="h5">Note: {note.name}</Typography>
            </AccordionSummary>
            {expanded && (
                <AccordionDetails>
                    <Typography variant="body1">{note.content}</Typography>
                    <Link to={`/courses/${courseId}/topics/${topicId}/notes/${note.id}`}>
                        <Button variant="contained" color="primary">View More</Button>
                    </Link>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

export default NoteIndexCard;