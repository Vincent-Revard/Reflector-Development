import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import NewNote from './newNote';
import { useProviderContext } from './ContextProvider';
import { useToast } from './ToastContext';

const StyledCard = styled(Card)({
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
});

const NoteCard = ({ note, courseId, topicId }) => {
    const handleDeleteContextById = useProviderContext().handleDeleteContextById
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();
    const Navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (noteId) => {
        handleDeleteContextById(courseId, topicId, noteId)
            .then(() => {
                showToast('success', 'Note deleted successfully!')
                setTimeout(() => {
                    Navigate('/courses')
                }, 2000);
            })
            .catch(error => {
                showToast('error', `Error deleting note! ${error.message}`)
                console.error(error);
            });
        setOpen(false);
    };

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
                <div>
                    <Button variant="outlined" color="error" onClick={handleClickOpen}>
                        Delete Note
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Note"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete this note? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => { handleDelete(note.id) }} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <Link to="/courses/8/topics/3/notes/new" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                        Create New Note
                    </Button>
                </Link>
            </CardContent>
        </StyledCard>
    );
}

export default NoteCard