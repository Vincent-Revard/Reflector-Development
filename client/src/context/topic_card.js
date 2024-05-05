import React, { useState } from 'react';
import NoteCard from './note_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { styled } from '@mui/material';
import { Button, Card, CardContent, Typography } from '@mui/material';

const StyledCard = styled(Card)({
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '15px',
});

const StyledButton = styled(Button)({
  margin: '10px',
});

const TopicCard = ({ data, courseId }) => {
    const [expanded, setExpanded] = useState(false);
    const [expandedNoteId, setExpandedNoteId] = useState(null);

    const { user } = useAuth();

  
    const handleCardClick = () => {
      setExpanded(!expanded);
    };

  const handleNoteClick = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };
  return (
    <>
      <StyledCard>
        <CardContent>
          {user.id === data.creator_id && (
            <>
              <Link to={`/courses/${courseId}/topics/${data.id}/edit`}>
                <StyledButton variant="contained" color="primary">
                  Edit Topic
                </StyledButton>
              </Link>
            </>
          )}
          <Link to={`/courses/${courseId}/topics/new`}>
            <StyledButton variant="contained" color="primary">
              New Topic
            </StyledButton>
          </Link>
          <Link to={`/courses/${courseId}/topics/${data.id}/notes/new`}>
            <StyledButton variant="contained" color="primary">
              New Note
            </StyledButton>
          </Link>
          <StyledButton variant="contained" color="primary" onClick={handleCardClick}>
            {expanded ? 'Collapse Topic' : 'Expand Topic'}
          </StyledButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'blue' }}>Topic: {data.name}</Typography>
                {
                  expanded && data.notes && data.notes.map(note =>
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
                          <Link to={`/courses/${courseId}/topics/${data.id}/notes/${note.id}`}>
                            <StyledButton variant="contained" color="primary">
                              View Additional Note Details
                            </StyledButton>
                          </Link>
                        </>
                      )}
                    </div>
                  )
                }
              </CardContent>
            </StyledCard>
          </>
          );
};

export default TopicCard;
