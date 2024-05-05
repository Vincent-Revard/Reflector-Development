import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
});

const NoteCard = ({ data, courseId, topicId }) => {
    const { user } = useAuth();
    console.log(`data: ${data}, courseId: ${courseId}, topicId: ${topicId}`)

    if (!data) {
        return <CircularProgress />;
    }

    return (
        <StyledCard>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Note: {data.name}</Typography>
                <Typography variant="body1">Category: {data.category}</Typography>
                <Typography variant="body1">Content: {data.content}</Typography>
                <Typography variant="body1">Title: {data.title}</Typography>
                <Typography variant="body1">Note References:</Typography>
                <ul>
                    {data.note_references.map((ref, index) => (
                        <li key={index}>{ref}</li>
                    ))}
                </ul>
            </CardContent>
        </StyledCard>
    );
}


export default NoteCard