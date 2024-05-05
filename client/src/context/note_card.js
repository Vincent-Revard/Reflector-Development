import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import NewNote from './newNote';
import { useProviderContext } from './ContextProvider';

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
});

const NoteCard = ({ note, courseId, topicId }) => {
    const { user } = useAuth();

    if (!note) {
        return <CircularProgress />;
    }

    return (
        <StyledCard>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Note: {note.name}</Typography>
                <Typography variant="body1">Category: {note.category}</Typography>
                <Typography variant="body1">Content: {note.content}</Typography>
                <Typography variant="body1">Title: {note.title}</Typography>
                <Typography variant="body1">Note References:</Typography>
                <ul>
                    {note.references && note.references.length > 0 ? (
                        note.references.map((ref, index) => (
                            <li key={index}>{ref}</li>
                        ))
                    ) : (
                        <li>No attached references!</li>
                    )}
                </ul>
                <Link to={`/courses/${courseId}/topics/${topicId}/notes/${note.id}/edit`}>
                    <Button variant="contained" color="primary">
                        Edit Note
                    </Button>
                </Link>
            </CardContent>
        </StyledCard>
    );
}

export default NoteCard