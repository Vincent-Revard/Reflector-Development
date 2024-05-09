import React, { useState } from 'react';
import NoteCard from './note_card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { styled } from '@mui/material';
import { Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import SearchAndAddCourseOrTopic from './search_or_add_course_and_topic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// const StyledCard = styled(Card)({
//   margin: '20px 0',
//   padding: '20px',
//   backgroundColor: '#f5f5f5',
//   borderRadius: '15px',
// });


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
  // console.log('topic_card: user.id'`${user?.id}` ,'data.creator_id:'`${data.creator_id}`)
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'blue' }}>Topic: {topic.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {user.id === topic.creator_id && (
          <Link to={`/courses/${courseId}/topics/${topic.id}/edit`}>
            <Button variant="contained" color="primary">
              Edit Topic
            </Button>
          </Link>
        )}
        {/* <Link to={`/courses/${courseId}/topics/new`} type="topic">
          <Button variant="contained" color="primary">
            New Topic
          </Button>
        </Link> */}
        <Link to={`/courses/${courseId}/topics/${topic.id}/notes/new`}>
          <Button variant="contained" color="primary">
            New Note
          </Button>
        </Link>
        {/* <Link to={`/courses/${courseId}/topics/enroll`}>
          <Button variant="contained" color="primary">
          Add a topic to this course
          </Button>
        </Link> */}
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
                  <Link to={`/courses/${courseId}/topics/${topic.id}/notes/${note.id}`}>
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
