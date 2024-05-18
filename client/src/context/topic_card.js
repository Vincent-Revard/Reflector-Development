import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TopicCard = ({ topic, courseId }) => {
    const [expanded, setExpanded] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const { user } = useAuth();
  console.log(user)
  console.log(user.id)
  console.log(topic.id)
  
    const handleCardClick = () => {
      setExpanded(!expanded);
    };

  const handleNoteClick = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'blue' }}>Topic: {topic.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {user.id === topic.creator_id && (
          <Link to={`/course/${courseId}/topic/${topic.id}/edit`}>
            <Button variant="contained" color="primary">
              Edit Topic
            </Button>
          </Link>
        )}
        <Link to={`/course/${courseId}/topic/${topic.id}/note/new`}>
          <Button variant="contained" color="primary">
            New Note
          </Button>
        </Link>
        <Button variant="contained" color="primary" onClick={handleCardClick}>
          {expanded ? 'Collapse Topic' : 'Expand Topic'}
        </Button>
        {
          expanded && topic.notes && topic.notes.map(note =>
            <div key={note.id}>
              <Typography variant="h6" sx={{
                fontWeight: 'bold', color: 'blue', cursor: 'pointer',
                '&:hover': {
                  color: 'darkblue',
                }
              }}
                title="Click to view note details"
                onClick={() => handleNoteClick(note.id)}>
                Note: {note.name}
              </Typography>
              {expandedNoteId === note.id && (
                <>
                  <Typography variant="body1" sx={{ color: 'black', marginTop: '1em', marginBottom: '1em' }}>
                    Note Content: {note.content}
                  </Typography>
                  <Link to={`/course/${courseId}/topic/${topic.id}/note/${note.id}`}>
                    <Button variant="contained" color="primary">
                      View Additional Note Details
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )
        }
      </AccordionDetails>
    </Accordion>
  );
};

export default TopicCard;
