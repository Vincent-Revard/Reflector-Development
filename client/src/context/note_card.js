import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Grid, Box, Paper } from '@mui/material';
import { useProviderContext } from './ContextProvider';
import { useToast } from './ToastContext';

const NoteCard = ({ note, courseId, topicId }) => {
    const handleDeleteContextById = useProviderContext().handleDeleteContextById
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

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
                    navigate(`/course/${courseId}/topic/${topicId}`)
                }, 2000);
            })
            .catch(error => {
                showToast('error', `Error deleting note! ${error.message}`)
                console.error(error);
            });
        setOpen(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">Topic: {note.topic?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'blue' }}>Note: {note.name}</Typography>
                <Typography variant="body1">Title: {note.title}</Typography>
                <Typography variant="body1">Category: {note.category}</Typography>
            </Grid>
            <Grid item xs={12}>
                {note.references && note.references.length > 0 && note.references.map((ref, index) => (
                    <Box key={index} sx={{ mt: 4 }}>
                        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">Reference {index + 1}</Typography>
                            <Typography variant="body1">Name: {ref.reference.name}</Typography>
                            <Typography variant="body1">Title: {ref.reference.title}</Typography>
                            <Typography variant="body1">URL: <a href={ref.reference.url}>{ref.reference.url}</a></Typography>
                            <Typography variant="body1">Published: {ref.reference.publication_day} {ref.reference.publication_month} {ref.reference.publication_year}</Typography>
                            <Typography variant="body1">Accessed: {ref.reference.access_day} {ref.reference.access_month} {ref.reference.access_year}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="body1">Content: {note.content}</Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Link to={`/course/${courseId}/topic/${topicId}/note`}>
                    <Button variant="contained" color="primary">
                        Back to Notes
                    </Button>
                </Link>
                <Link to={`/course/${courseId}/topic/${topicId}/note/${note.id}/edit`}>
                    <Button variant="contained" color="primary">
                        Edit Note
                    </Button>
                </Link>
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
            </Grid>
        </Grid>
    );
}


export default NoteCard;